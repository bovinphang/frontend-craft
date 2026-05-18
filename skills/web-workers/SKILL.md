---
name: fec-web-workers
description: Web Workers 规范，涵盖 Worker 创建、Vite/Webpack 集成、Transferable Objects、Comlink 模式、SharedWorker 与 Worker 池。当用户提到后台线程、Web Worker、计算密集型、主线程阻塞、Worker 池时自动激活。
version: 1.0.0
---

# Web Workers

将计算密集型任务移至后台线程，保持主线程（UI）流畅响应。

## Purpose

避免复杂计算阻塞浏览器主线程，在图像处理、大数据解析、加密运算等场景下保持 UI 60fps 流畅度和用户输入响应。

## When to Use

- 图像处理 / 滤镜 / Canvas 操作
- 解析大型 JSON / CSV / XML 文件（> 1MB）
- 复杂加密运算（RSA、AES 批量处理）
- 代码高亮（编辑器场景）
- 数据可视化计算（图表布局、路径规划）
- 主线程出现明显卡顿（FPS < 30，输入延迟 > 100ms）

**不适用**：

- 需要操作 DOM 的任务（Worker 无 window/document 访问权限）
- 轻量计算（< 10ms 同步操作不值得开 Worker）
- 高频通信场景（消息序列化开销可能超过计算收益）

## Procedure

### 1. 基础 Worker

独立 Worker 文件，通过 `postMessage` / `onmessage` 与主线程通信：

```ts
// workers/heavy-compute.worker.ts
self.onmessage = (e: MessageEvent<{ numbers: number[] }>) => {
  const { numbers } = e.data;
  const result = heavySort(numbers); // 耗时排序
  self.postMessage(result);
};

function heavySort(arr: number[]): number[] {
  // 模拟 CPU 密集计算
  return arr.sort((a, b) => a - b);
}
```

### 2. Vite 集成

Vite 原生支持 `?worker` 导入语法，无需额外配置：

```ts
// main.ts
import HeavyComputeWorker from "./workers/heavy-compute.worker?worker";

const worker = new HeavyComputeWorker();

worker.postMessage({ numbers: [3, 1, 4, 1, 5, 9, 2, 6] });

worker.onmessage = (e: MessageEvent<number[]>) => {
  console.log("排序结果:", e.data);
};

worker.onerror = (err: ErrorEvent) => {
  console.error("Worker 错误:", err.message);
};

// 组件卸载时务必终止 Worker
// worker.terminate();
```

### 3. React Hook 封装

将 Worker 封装为 Hook，自动管理生命周期：

```tsx
// hooks/useWorker.ts
import { useEffect, useRef, useCallback, useState } from "react";

export function useWorker<TReq, TRes>(workerFactory: () => Worker) {
  const workerRef = useRef<Worker | null>(null);
  const [result, setResult] = useState<TRes | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    workerRef.current = workerFactory();

    workerRef.current.onmessage = (e: MessageEvent<TRes>) => {
      setResult(e.data);
      setIsRunning(false);
    };

    workerRef.current.onerror = (err: ErrorEvent) => {
      setError(err.message);
      setIsRunning(false);
    };

    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, []);

  const run = useCallback((data: TReq) => {
    setIsRunning(true);
    setError(null);
    setResult(null);
    workerRef.current?.postMessage(data);
  }, []);

  return { run, result, isRunning, error };
}
```

使用示例：

```tsx
// ImageProcessor.tsx
import { useWorker } from "./hooks/useWorker";
import ImageWorker from "./workers/image-processor.worker?worker";

const ImageProcessor = ({ imageData }: { imageData: ImageData }) => {
  const { run, result, isRunning, error } = useWorker<ImageData, ImageData>(
    () => new ImageWorker(),
  );

  return (
    <div>
      <button onClick={() => run(imageData)} disabled={isRunning}>
        {isRunning ? "处理中..." : "添加滤镜"}
      </button>
      {error && <p role="alert">处理失败: {error}</p>}
      {result && <img src={URL.createObjectURL(dataURIToBlob(result))} />}
    </div>
  );
};
```

### 4. Transferable Objects（零拷贝）

传输大型 ArrayBuffer 时使用 `transfer` 参数避免结构化克隆的拷贝开销：

```ts
// 主线程 — 将 ArrayBuffer 的所有权转移给 Worker（零拷贝）
const buffer = new ArrayBuffer(1024 * 1024 * 10); // 10MB
worker.postMessage(buffer, [buffer]);
// 注意: 转移后主线程中的 buffer.byteLength 变为 0，不可再使用

// Worker 线程 — 处理完毕后转移回主线程
self.onmessage = (e) => {
  const buffer: ArrayBuffer = e.data;
  // ... 处理 buffer
  self.postMessage(buffer, [buffer]);
};
```

**适用场景**：图片像素数据、音频采样、大型二进制文件。
**注意**：Transfer 后原引用失效，不可再读取。

### 5. Comlink 模式（RPC 风格）

使用 `comlink` 库简化 Worker 通信，将消息传递抽象为函数调用：

```bash
npm install comlink
```

```ts
// workers/math.worker.ts
import { expose } from "comlink";

const mathApi = {
  async fibonacci(n: number): Promise<number> {
    if (n <= 1) return n;
    return this.fibonacci(n - 1) + this.fibonacci(n - 2);
  },

  async batchProcess(items: number[]): Promise<number[]> {
    return items.map((x) => x * 2);
  },
};

expose(mathApi);
```

```ts
// main.ts
import { wrap } from "comlink";
import MathWorker from "./workers/math.worker?worker";

const mathApi = wrap<typeof import("./workers/math.worker").mathApi>(
  new MathWorker(),
);

// 像普通 async 函数一样调用
const result = await mathApi.fibonacci(40);
const batched = await mathApi.batchProcess([1, 2, 3]);
```

### 6. Worker 池

对于大量独立小任务，复用 Worker 避免频繁创建/销毁：

```ts
// worker-pool.ts
export class WorkerPool<TReq, TRes> {
  private workers: Worker[];
  private queue: Array<{
    data: TReq;
    resolve: (v: TRes) => void;
    reject: (e: Error) => void;
  }> = [];
  private active = 0;

  constructor(
    private factory: () => Worker,
    private size: number = navigator.hardwareConcurrency || 4,
  ) {
    this.workers = Array.from({ length: this.size }, () => {
      const w = this.factory();
      w.onmessage = (e) => this.onWorkerDone(w, e.data);
      w.onerror = (err) => this.onWorkerError(w, new Error(err.message));
      return w;
    });
  }

  run(data: TReq): Promise<TRes> {
    return new Promise((resolve, reject) => {
      const idleWorker = this.workers.find((w) => !this.isBusy(w));
      if (idleWorker) {
        this.execute(idleWorker, data, resolve, reject);
      } else {
        this.queue.push({ data, resolve, reject });
      }
    });
  }

  private execute(
    worker: Worker,
    data: TReq,
    resolve: (v: TRes) => void,
    reject: (e: Error) => void,
  ) {
    this.active++;
    (worker as unknown as { _resolve?: (v: TRes) => void })._resolve = resolve;
    (worker as unknown as { _reject?: (e: Error) => void })._reject = reject;
    worker.postMessage(data);
  }

  private onWorkerDone(worker: Worker, result: TRes) {
    const resolve = (worker as unknown as { _resolve?: (v: TRes) => void })
      ._resolve;
    resolve?.(result);
    this.active--;
    this.processQueue(worker);
  }

  private onWorkerError(worker: Worker, error: Error) {
    const reject = (worker as unknown as { _reject?: (e: Error) => void })
      ._reject;
    reject?.(error);
    this.active--;
    this.processQueue(worker);
  }

  private processQueue(worker: Worker) {
    const next = this.queue.shift();
    if (next) {
      this.execute(worker, next.data, next.resolve, next.reject);
    }
  }

  private isBusy(worker: Worker): boolean {
    return !!(worker as unknown as { _resolve?: unknown })._resolve;
  }

  terminate() {
    this.workers.forEach((w) => w.terminate());
  }
}
```

### 7. SharedWorker（跨 Tab 共享）

多个标签页共享同一个 Worker 实例，适合跨 Tab 数据同步：

```ts
// shared.worker.ts
const connections: MessagePort[] = [];

self.onconnect = (e: MessageEvent) => {
  const port = e.ports[0];
  connections.push(port);

  port.onmessage = (e) => {
    // 广播给所有连接的标签页
    connections.forEach((p) => {
      if (p !== port) p.postMessage(e.data);
    });
  };
};
```

```ts
// 主线程
const sharedWorker = new SharedWorker("./shared.worker.ts");
sharedWorker.port.start();
sharedWorker.port.onmessage = (e) => {
  console.log("来自其他 Tab 的消息:", e.data);
};
```

## Constraints

- **无 DOM 访问**: Worker 中无法使用 `window`、`document`、`alert()`，必须通过 `postMessage` 将结果传回主线程更新 UI
- **序列化开销**: `postMessage` 使用结构化克隆算法，大型对象传递有成本。优先 Transferable Objects（零拷贝）或 Comlink
- **无阻塞 API**: Worker 中不能使用 `alert()` / `confirm()` / `localStorage`（同步 API），使用 `indexedDB` 替代
- **文件限制**: Worker 必须从同源加载，不可跨域。动态 import 可用（`import()` 在 Worker 中支持）
- **内存隔离**: 每个 Worker 有独立的 JS 堆，不能共享变量。通过消息传递或 `SharedArrayBuffer`（需 COOP/COEP 头）共享数据
- **CSP 注意**: Worker 受 `worker-src` CSP 指令约束，需在服务端配置

## Expected Output

- 计算密集型操作移至后台线程后，主线程 FPS 从 < 30 恢复到 60
- 用户输入响应延迟从 > 200ms 降至 < 16ms
- Worker 生命周期管理正确（组件卸载时 terminate，无内存泄漏）

## Related Agent

- [performance-optimizer](../../agents/performance-optimizer.md) — 通过 Profiler 验证 Worker 效果，识别主线程阻塞
