---
name: fec-form-handling
description: Use when building or reviewing forms with React Hook Form, Zod validation, dynamic fields, controlled third-party inputs, file upload, multi-step forms, dependent validation, or form performance; Chinese triggers include 表单, 表单校验, 动态字段.
---

# 表单处理

使用 React Hook Form + Zod 构建高性能、类型安全、可访问的表单。

## Purpose

管理表单状态、校验和提交流程，避免受控组件每次键入触发全表单重渲染，在复杂表单场景下保持输入流畅度。

## When to Use

- 复杂表单（10+ 字段、动态字段、嵌套对象、数组字段）
- 需要实时校验反馈（必填、格式、联动校验）
- 多步表单（Wizard）或动态增减字段
- 文件上传表单
- 受控组件出现输入延迟（typing lag）

**不适用**：

- 极简表单（2-3 个字段、无校验）可用原生受控组件 + 手动校验

## Procedure

### 1. 安装

```bash
npm install react-hook-form zod @hookform/resolvers
```

### 2. 定义 Schema + 基础表单

Zod schema 同时提供运行时校验和 TypeScript 类型推导：

```ts
// schema.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("请输入有效的邮箱地址").min(1, "邮箱不能为空"),
  password: z
    .string()
    .min(8, "密码至少 8 个字符")
    .regex(/[A-Z]/, "密码需包含至少一个大写字母"),
  rememberMe: z.boolean().optional(),
});

export type LoginForm = z.infer<typeof loginSchema>; // 自动推导类型
```

```tsx
// LoginForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginForm } from "./schema";

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginForm) => {
    await api.login(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <label htmlFor="email">邮箱</label>
      <input
        id="email"
        type="email"
        {...register("email")}
        aria-invalid={!!errors.email}
        aria-describedby={errors.email ? "email-error" : undefined}
      />
      {errors.email && (
        <span id="email-error" role="alert">
          {errors.email.message}
        </span>
      )}

      <label htmlFor="password">密码</label>
      <input
        id="password"
        type="password"
        {...register("password")}
        aria-invalid={!!errors.password}
      />
      {errors.password && <span role="alert">{errors.password.message}</span>}

      <input type="checkbox" {...register("rememberMe")} />
      <label>记住我</label>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "登录中..." : "登录"}
      </button>
    </form>
  );
};
```

**关键约定**：

- `noValidate` 禁用浏览器原生校验，统一走 Zod
- `aria-invalid` + `aria-describedby` 确保屏幕阅读器可读校验错误
- `id` + `htmlFor` 关联 label 和 input（可访问性）

### 3. 第三方组件集成（Controller）

对于不支持 `ref` 的 UI 库组件（Select、DatePicker、RichEditor），用 `Controller` 桥接：

```tsx
import { Controller, useForm } from "react-hook-form";
import { Select } from "antd"; // 或任何第三方组件

const UserForm = () => {
  const { control, handleSubmit } = useForm<UserForm>({
    /* ... */
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="role"
        control={control}
        rules={{ required: "请选择角色" }}
        render={({ field, fieldState }) => (
          <div>
            <Select
              {...field}
              options={[
                { label: "管理员", value: "admin" },
                { label: "编辑", value: "editor" },
              ]}
              placeholder="选择角色"
            />
            {fieldState.error && (
              <span role="alert">{fieldState.error.message}</span>
            )}
          </div>
        )}
      />
    </form>
  );
};
```

### 4. 动态字段（useFieldArray）

适用于可增减的列表型字段（联系人列表、标签、SKU 行）：

```tsx
import { useFieldArray, useForm } from "react-hook-form";

const schema = z.object({
  contacts: z.array(
    z.object({
      name: z.string().min(1),
      phone: z.string().regex(/^1\d{10}$/),
    }),
  ),
});

const ContactForm = () => {
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { contacts: [{ name: "", phone: "" }] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "contacts",
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {fields.map((field, index) => (
        <div key={field.id}>
          <input {...register(`contacts.${index}.name`)} placeholder="姓名" />
          <input {...register(`contacts.${index}.phone`)} placeholder="手机" />
          <button type="button" onClick={() => remove(index)}>
            删除
          </button>
        </div>
      ))}
      <button type="button" onClick={() => append({ name: "", phone: "" })}>
        添加联系人
      </button>
    </form>
  );
};
```

**注意**：`useFieldArray` 的 `key` 必须用 `field.id`（库内部生成），不要用 `index`。

### 5. 联动校验（依赖字段）

当某字段校验规则依赖另一字段值时：

```ts
const schema = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "两次密码不一致",
    path: ["confirmPassword"],
  });
```

或使用 Zod 的 `superRefine` 做多条件联动：

```ts
const schema = z
  .object({
    type: z.enum(["individual", "company"]),
    idNumber: z.string(),
    companyName: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === "company" && !data.companyName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "企业类型必须填写公司名称",
        path: ["companyName"],
      });
    }
    if (data.type === "individual" && !data.idNumber) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "个人类型必须填写身份证号",
        path: ["idNumber"],
      });
    }
  });
```

### 6. 文件上传

```tsx
const schema = z.object({
  avatar: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, "请上传头像")
    .refine((files) => files[0]?.size <= 5 * 1024 * 1024, "文件大小不超过 5MB")
    .refine(
      (files) => ["image/jpeg", "image/png"].includes(files[0]?.type),
      "仅支持 JPG/PNG 格式",
    ),
});

const UploadForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        const formData = new FormData();
        formData.append("avatar", data.avatar[0]);
        await api.upload(formData);
      })}
    >
      <input
        type="file"
        {...register("avatar")}
        accept="image/jpeg,image/png"
      />
      {errors.avatar && <span role="alert">{errors.avatar.message}</span>}
    </form>
  );
};
```

### 7. 表单性能优化

对于大型表单（50+ 字段），减少不必要的重渲染：

```tsx
// 用 useController 或 watch 替代全表单订阅
const { watch } = useForm();
const emailValue = watch("email"); // 仅订阅 email 字段

// 隔离输入组件，避免父表单重渲染
const MemoInput = React.memo(({ register, name }: { name: string }) => (
  <input {...register(name)} />
));
```

## Constraints

- **受控 vs 非受控**: 不要混合使用。React Hook Form 默认是非受控（uncontrolled），通过 `ref` 读取值。如需受控，用 `Controller`
- **默认值**: 必须提供 `defaultValues`，否则首次渲染时字段值为 `undefined` 可能导致警告
- **reset**: 调用 `reset()` 时用服务器返回的数据而非空对象，否则校验可能因字段缺失而失败
- **异步校验**: 用 `register('field', { validate: asyncFn })`，但注意 debounce，避免每次键入都触发网络请求
- **表单嵌套**: Zod `refine` / `superRefine` 的路径（`path`）必须准确指向报错字段，否则错误信息无法关联到 UI

## Expected Output

- 类型安全的表单组件，Schema 和 TypeScript 类型自动同步
- 实时校验反馈，输入时 60fps 无卡顿
- 可访问的错误提示（aria-invalid + role="alert"）
- 提交时自动阻止无效数据，按钮 loading 状态管理
