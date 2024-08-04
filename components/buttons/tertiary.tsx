"use client"

export default function TertiaryButton({
  children,
  onClick,
  justify,
  type
}: {
  children?: React.ReactNode,
  onClick?: () => void,
  justify?: "justify-center" | "justify-start" | "justify-end" | "justify-between" | "justify-around" | "justify-evenly",
  type?: "submit" | "button"
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-transparent text-white px-4 py-1 rounded-md shadow-lg flex items-center gap-2 ${justify}`}
    >
      {children}
    </button>
  )
}