"use client"

export default function SelectField({
  label,
  name,
  required,
  options,
  optionsSelected,
  disabled,
  onChange,
  multiple
}: {
  label?: string,
  name: string,
  required?: boolean,
  options: string[],
  optionsSelected?: string[],
  disabled?: boolean,
  onChange?: (value: string[]) => void,
  multiple?: boolean
}) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label htmlFor={name}>{required && !disabled && "*"}{label}</label>
      <select
        className="py-1 px-2 rounded border border-neutral-700 bg-transparent w-full"
        name={name}
        multiple={multiple}
        onChange={event => onChange && onChange(Array.from(event.target.selectedOptions, option => option.value))}
        value={optionsSelected}
        required={required}
        disabled={disabled}
      >
        {options.map((option, index) => (
          <option
            key={index}
            value={option}
            className="bg-black"
          >
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}