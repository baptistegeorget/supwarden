export function PrimaryButton({ children, onClick, className }: { children?: React.ReactNode, onClick?: () => void, className?: string }) {
  return (
    <button onClick={onClick} className={`${className} bg-white text-black px-4 py-2 rounded-md shadow-lg flex-1 flex items-center gap-2 justify-center`}>{children}</button>
  )
}

export function SecondaryButton({ children, onClick, className }: { children?: React.ReactNode, onClick?: () => void, className?: string }) {
  return (
    <button onClick={onClick} className={`${className} bg-black text-white px-4 py-2 rounded-md shadow-lg flex-1 flex items-center gap-2 justify-center border border-neutral-700`}>{children}</button>
  )
}

export function TertiaryButton({ children, onClick, className }: { children?: React.ReactNode, onClick?: () => void, className?: string }) {
  return (
    <button onClick={onClick} className={`${className} bg-transparent text-white px-4 py-2 rounded-md shadow-lg flex-1 flex items-center gap-2 justify-center`}>{children}</button>
  )
}