export default function TextAreaField({
  label,
  name,
  placeholder,
  required,
  minLength,
  maxLength,
  value,
  onChange
}: {
  label?: string,
  name: string,
  placeholder?: string,
  required?: boolean,
  minLength?: number,
  maxLength?: number,
  value?: string,
  onChange?: (value: string) => void
}) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label htmlFor={name}>{label}</label>}
      <textarea
        className="resize-none py-1 px-2 rounded border border-neutral-700 bg-transparent h-32 w-auto"
        name={name}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        maxLength={maxLength}
        value={value}
        onChange={e => onChange && onChange(e.target.value)}
      />
    </div>
  )
}