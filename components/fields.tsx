"use client"

import { useState } from "react"

export function TextField({
  label,
  name,
  placeholder,
  required,
  minLength,
  maxLength
}: {
  label: string,
  name: string,
  placeholder?: string,
  required?: boolean,
  minLength?: number,
  maxLength?: number
}) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label>{required && "*"}{label}</label>
      <input
        name={name}
        type="text"
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        maxLength={maxLength}
        className="py-1 px-2 rounded w-full border border-neutral-700 bg-transparent"
      />
    </div>
  )
}

export function EmailField({
  label,
  name,
  placeholder,
  required
}: {
  label: string,
  name: string,
  placeholder?: string,
  required?: boolean
}) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label>{required && "*"}{label}</label>
      <input
        name={name}
        type="email"
        placeholder={placeholder}
        required={required}
        className="py-1 px-2 rounded w-full border border-neutral-700 bg-transparent"
      />
    </div>
  )
}

export function PasswordField({
  label,
  name,
  placeholder,
  required,
  minLength,
  maxLength
}: {
  label: string,
  name: string,
  placeholder?: string,
  required?: boolean,
  minLength?: number,
  maxLength?: number
}) {
  const [showPassword, setShowPassword] = useState<boolean>(false)

  function toggleShowPassword() {
    setShowPassword(!showPassword)
  }

  return (
    <div className="flex flex-col gap-1 w-full">
      <label>{required && "*"}{label}</label>
      <div className="flex items-center relative">
        <input
          name={name}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          required={required}
          minLength={minLength}
          maxLength={maxLength}
          className="py-1 px-2 rounded w-full border border-neutral-700 bg-transparent pr-10"
        />
        <span onClick={toggleShowPassword} className="absolute right-2 cursor-pointer">
          {showPassword ? <svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M2.22 2.22a.75.75 0 0 0-.073.976l.073.084 4.034 4.035a9.986 9.986 0 0 0-3.955 5.75.75.75 0 0 0 1.455.364 8.49 8.49 0 0 1 3.58-5.034l1.81 1.81A4 4 0 0 0 14.8 15.86l5.919 5.92a.75.75 0 0 0 1.133-.977l-.073-.084-6.113-6.114.001-.002-6.95-6.946.002-.002-1.133-1.13L3.28 2.22a.75.75 0 0 0-1.06 0ZM12 5.5c-1 0-1.97.148-2.889.425l1.237 1.236a8.503 8.503 0 0 1 9.899 6.272.75.75 0 0 0 1.455-.363A10.003 10.003 0 0 0 12 5.5Zm.195 3.51 3.801 3.8a4.003 4.003 0 0 0-3.801-3.8Z" fill="#ffffff" /></svg> : <svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 9.005a4 4 0 1 1 0 8 4 4 0 0 1 0-8ZM12 5.5c4.613 0 8.596 3.15 9.701 7.564a.75.75 0 1 1-1.455.365 8.503 8.503 0 0 0-16.493.004.75.75 0 0 1-1.455-.363A10.003 10.003 0 0 1 12 5.5Z" fill="#ffffff" /></svg>}
        </span>
      </div>
    </div>
  )
}