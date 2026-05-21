# 高级表单模式

## Controller

```tsx
<Controller
  name="role"
  control={control}
  rules={{ required: "请选择角色" }}
  render={({ field, fieldState }) => (
    <>
      <Select {...field} options={roleOptions} />
      {fieldState.error && <span role="alert">{fieldState.error.message}</span>}
    </>
  )}
/>
```

用于不暴露原生 `ref` 的 Select、DatePicker、RichEditor 等组件。

## 动态字段

```tsx
const { fields, append, remove } = useFieldArray({
  control,
  name: "contacts",
});

{fields.map((field, index) => (
  <div key={field.id}>
    <input {...register(`contacts.${index}.name`)} />
    <button type="button" onClick={() => remove(index)}>删除</button>
  </div>
))}
```

`key` 必须使用 `field.id`，不要使用数组 index。

## 联动校验

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

## 文件上传

```ts
const schema = z.object({
  avatar: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, "请上传头像")
    .refine((files) => files[0]?.size <= 5 * 1024 * 1024, "文件大小不超过 5MB")
    .refine((files) => ["image/jpeg", "image/png"].includes(files[0]?.type), "仅支持 JPG/PNG"),
});
```

提交时用 `FormData`，不要把 `File` JSON 序列化。

## 性能

- 用 `useWatch` 或字段级订阅替代全表单 watch。
- 大表单拆成 memoized 子组件。
- 高频输入不要每次键入触发网络校验。
- 多步表单要明确每步 schema 和跨步最终 schema。
