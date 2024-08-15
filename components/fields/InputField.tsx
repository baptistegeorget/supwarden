"use client"

import { HTMLInputTypeAttribute } from "react"

export default function InputField({
  label,
  name,
  placeholder,
  type,
  required,
  minLength,
  maxLength,
  value,
  readOnly,
  disabled,
  onChange
}: {
  label?: string,
  name: string,
  placeholder?: string,
  type: HTMLInputTypeAttribute,
  required?: boolean,
  minLength?: number,
  maxLength?: number,
  value?: string,
  readOnly?: boolean,
  disabled?: boolean,
  onChange?: (value: string | FileList | null) => void
}) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (type === 'file') {
      const file = e.target.files ? e.target.files : null
      if (onChange) {
        onChange(file)
      }
    } else {
      if (onChange) {
        onChange(e.target.value);
      }
    }
  }

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label htmlFor={name}>{required && !readOnly && !disabled && "*"}{label}</label>}
      <input
        className="py-1 px-2 rounded border border-neutral-700 bg-transparent w-full"
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        maxLength={maxLength}
        value={value}
        onChange={handleChange}
        readOnly={readOnly}
        disabled={disabled}
      />
    </div>
  )
}