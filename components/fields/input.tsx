import { HTMLInputTypeAttribute } from "react"

export default function InputField({
  label,
  name,
  placeholder,
  type,
  required,
  minLength,
  maxLength,
  value
}: {
  label?: string,
  name: string,
  placeholder?: string,
  type: HTMLInputTypeAttribute,
  required?: boolean,
  minLength?: number,
  maxLength?: number,
  value?: string
}) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label htmlFor={name}>{required && "*"}{label}</label>}
      <input
        className="py-1 px-2 rounded border border-neutral-700 bg-transparent w-auto"
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        maxLength={maxLength}
        value={value}
      />
    </div>
  )
}