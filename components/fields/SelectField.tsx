"use client"

export default function SelectField({
  label,
  name,
  options,
  optionSelected,
  onChange,
  multiple
}: {
  label?: string,
  name: string,
  options: string[],
  optionSelected?: string,
  onChange?: (value: string) => void,
  multiple?: boolean
}) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label htmlFor={name}>{label}</label>
      <select
        className="py-1 px-2 rounded border border-neutral-700 bg-transparent w-auto"
        name={name}
        multiple={multiple}
        onChange={event => onChange && onChange(event.target.value)}
      >
        {options.map((option, index) => (
          <option
            key={index}
            value={option}
            className="bg-black"
            selected={option === optionSelected}
          >
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}