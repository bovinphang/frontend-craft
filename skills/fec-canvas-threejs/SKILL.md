---
name: fec-canvas-threejs
description: Use when building or reviewing Canvas 2D, Three.js/WebGL, React Three Fiber, 3D scenes, visualization, game rendering, animation loops, or rendering performance; Chinese triggers include Canvas, Three.js, WebGL, 3D, 数据可视化, 游戏.
---

# Canvas 与 Three.js

在浏览器中渲染 2D (Canvas API) 或 3D (Three.js/WebGL) 图形，用于数据可视化、游戏、创意效果。

## Purpose

突破 DOM 渲染限制，在浏览器中实现高性能的 2D/3D 图形渲染，适用于数据可视化、游戏、创意交互和产品展示。

## When to Use

- **Canvas 2D**: 图表、简单游戏、图片编辑、签名板、粒子效果
- **Three.js 3D**: 3D 模型展示、沉浸式体验、复杂粒子系统、建筑可视化
- **React Three Fiber**: React 项目中声明式 3D 场景

**不适用**：

- 标准 UI 组件（按钮、表单、列表）— 用 DOM 元素
- 需要 SEO 索引的内容
- 需要屏幕阅读器访问的内容（Canvas 对无障碍不友好）

## Procedure

### 1. Canvas 2D 基础

```html
<canvas id="chart" width="800" height="400"></canvas>
```

```ts
const canvas = document.getElementById("chart") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

// 高 DPI 适配
const dpr = window.devicePixelRatio || 1;
canvas.width = 800 * dpr;
canvas.height = 400 * dpr;
canvas.style.width = "800px";
canvas.style.height = "400px";
ctx.scale(dpr, dpr);

// 绘制矩形
ctx.fillStyle = "#3b82f6";
ctx.fillRect(10, 10, 50, 50);

// 绘制圆形
ctx.beginPath();
ctx.arc(100, 100, 30, 0, Math.PI * 2);
ctx.fillStyle = "#ef4444";
ctx.fill();

// 绘制文本
ctx.font = "16px sans-serif";
ctx.fillStyle = "#1a1a1a";
ctx.fillText("Hello Canvas", 50, 150);
```

### 2. Canvas 动画循环

```ts
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

function createParticleSystem(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d")!;
  const particles: Particle[] = Array.from({ length: 50 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 2,
    vy: (Math.random() - 0.5) * 2,
    radius: Math.random() * 3 + 1,
  }));

  let animationId: number;

  function animate() {
    // 清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 更新 + 绘制
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      // 边界反弹
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = "#3b82f6";
      ctx.fill();
    }

    animationId = requestAnimationFrame(animate);
  }

  animate();

  // 返回清理函数
  return () => cancelAnimationFrame(animationId);
}
```

### 3. Three.js 3D 场景

```bash
npm install three
```

```ts
import * as THREE from "three";

function createScene(container: HTMLElement) {
  // 场景
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a1a2e);

  // 相机
  const camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000,
  );
  camera.position.z = 5;

  // 渲染器
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // 限制像素比
  container.appendChild(renderer.domElement);

  // 物体
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  // 灯光（StandardMaterial 需要光源）
  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);

  // 动画循环
  let animationId: number;
  function animate() {
    animationId = requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
  }
  animate();

  // 响应式
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const { width, height } = entry.contentRect;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
  });
  resizeObserver.observe(container);

  // 清理
  return () => {
    cancelAnimationFrame(animationId);
    resizeObserver.disconnect();
    renderer.dispose();
    geometry.dispose();
    material.dispose();
    container.removeChild(renderer.domElement);
  };
}
```

### 4. React Three Fiber（声明式 3D）

```bash
npm install three @react-three/fiber @react-three/drei
```

```tsx
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Box } from "@react-three/drei";

function SpinningBox({
  color,
  position,
}: {
  color: string;
  position: [number, number, number];
}) {
  return (
    <Box position={position}>
      <meshStandardMaterial color={color} />
    </Box>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} />
      <SpinningBox color="hotpink" position={[-1.5, 0, 0]} />
      <SpinningBox color="lightblue" position={[1.5, 0, 0]} />
      <OrbitControls /> {/* 鼠标旋转控制 */}
    </>
  );
}

// 使用
function App() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 75 }}
      style={{ height: "100vh" }}
      role="img"
      aria-label="3D 场景展示"
    >
      <Scene />
    </Canvas>
  );
}
```

**drei 常用辅助组件**：

- `OrbitControls` — 鼠标旋转/缩放控制
- `Environment` — 环境贴图（HDRI 照明）
- `Text` — 3D 文字
- `Html` — 在 3D 场景中嵌入 HTML
- `useGLTF` — 加载 3D 模型
- `ContactShadows` — 接触阴影

### 5. 性能优化

| 优化项         | 方法                                              |
| -------------- | ------------------------------------------------- |
| **几何体面数** | 使用 LOD（Level of Detail），远处用低精度模型     |
| **纹理大小**   | 限制纹理 ≤ 2048×2048，使用压缩纹理（KTX2/DDS）    |
| **像素比**     | `setPixelRatio(Math.min(dpr, 2))`，限制最大像素比 |
| **渲染循环**   | 不需要重绘时暂停 animation loop（用标志位控制）   |
| **几何体复用** | InstancedMesh 批量渲染相同几何体                  |
| **内存释放**   | dispose geometry / material / texture，移除时清理 |
| **Web Worker** | 复杂计算（物理引擎、路径规划）移至 Worker         |

```ts
// InstancedMesh — 批量渲染 10000 个相同立方体
const count = 10000;
const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const mesh = new THREE.InstancedMesh(geometry, material, count);

const dummy = new THREE.Object3D();
for (let i = 0; i < count; i++) {
  dummy.position.set(
    (Math.random() - 0.5) * 100,
    (Math.random() - 0.5) * 100,
    (Math.random() - 0.5) * 100,
  );
  dummy.updateMatrix();
  mesh.setMatrixAt(i, dummy.matrix);
}
scene.add(mesh);
```

## Constraints

- **无 DOM 访问**: Canvas 内容对屏幕阅读器不可见，必须提供 `aria-label` 或替代文本
- **GPU 密集**: WebGL 渲染消耗 GPU 资源，低端设备可能卡顿。控制面数、纹理大小和像素比
- **内存泄漏**: Three.js 的 geometry / material / texture 必须手动 `dispose()`，否则 GPU 内存不释放
- **响应式**: Canvas 不会自动适应容器尺寸变化，需要 ResizeObserver 同步更新
- **高 DPI**: 必须适配 `devicePixelRatio`，否则在 Retina 屏幕上模糊
- **无障碍**: Canvas 3D 场景无法被键盘导航，需要提供替代交互方式

## Expected Output

- 流畅的 2D/3D 渲染（60fps），无明显卡顿
- 响应式适配（容器变化时自动调整）
- 高 DPI 屏幕渲染清晰（pixelRatio 适配）
- 资源正确清理（dispose + cancelAnimationFrame）
- 可访问性兜底（aria-label / 替代文本）

## Related Agent

- [performance-optimizer](../../agents/performance-optimizer.md) — 3D 场景性能分析与优化
- [figma-implementer](../../agents/figma-implementer.md) — 设计稿中的 Canvas 元素实现
