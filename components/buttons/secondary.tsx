export default function SecondaryButton({
  children,
  onClick,
  justify,
  type
}: {
  children?: React.ReactNode,
  onClick?: () => void,
  justify?: "justify-center" | "justify-start" | "justify-end",
  type?: "submit" | "button"
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-black text-white px-4 py-1 rounded-md shadow-lg flex items-center gap-2 border border-neutral-700 ${justify}`}
    >
      {children}
    </button>
  )
}