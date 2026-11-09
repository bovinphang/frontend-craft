## 更安全的泛型组件模式

```tsx
interface Entity {
  id: string;
}

interface EntityPickerProps<TEntity extends Entity> {
  items: TEntity[];
  selectedId: string | null;
  getLabel: (item: TEntity) => string;
  onSelect: (item: TEntity) => void;
}

export function EntityPicker<TEntity extends Entity>({
  items,
  selectedId,
  getLabel,
  onSelect,
}: EntityPickerProps<TEntity>) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          <button
            aria-pressed={item.id === selectedId}
            type="button"
            onClick={() => onSelect(item)}
          >
            {getLabel(item)}
          </button>
        </li>
      ))}
    </ul>
  );
}
```
