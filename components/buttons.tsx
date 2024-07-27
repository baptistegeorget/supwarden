export function PrimaryButton({ children, onClick, className }: { children?: React.ReactNode, onClick?: () => void, className?: string }) {
  return (
    <button onClick={onClick} className={`bg-white text-black px-2 py-1 rounded-md shadow-lg flex-1 flex items-center gap-2 ${className}`}>{children}</button>
  )
}

export function SecondaryButton({ children, onClick, className }: { children?: React.ReactNode, onClick?: () => void, className?: string }) {
  return (
    <button onClick={onClick} className={`bg-black text-white px-2 py-1 rounded-md shadow-lg flex-1 flex items-center gap-2 border border-neutral-700 ${className}`}>{children}</button>
  )
}

export function TertiaryButton({ children, onClick, className }: { children?: React.ReactNode, onClick?: () => void, className?: string }) {
  return (
    <button onClick={onClick} className={`bg-transparent text-white px-2 py-1 rounded-md shadow-lg flex-1 flex items-center gap-2 ${className}`}>{children}</button>
  )
}