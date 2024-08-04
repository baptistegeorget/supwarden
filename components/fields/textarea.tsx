export default function TextAreaField({
  label,
  name,
  placeholder,
  required,
  minLength,
  maxLength
}: {
  label?: string,
  name: string,
  placeholder?: string,
  required?: boolean,
  minLength?: number,
  maxLength?: number
}) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label htmlFor={name}>{label}</label>}
      <textarea
        className="resize-none py-1 px-2 rounded w-full border border-neutral-700 bg-transparent h-32 min-w-64"
        name={name}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        maxLength={maxLength}
      >
      </textarea>
    </div>
  )
}