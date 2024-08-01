export function WebSiteTitle({ children }: { children?: React.ReactNode }) {
  return <span className="text-center text-2xl font-bold">{children}</span>
}

export function Title({ children }: { children?: React.ReactNode }) {
  return <h1 className="text-xl font-bold">{children}</h1>
}

export function Subtitle({ children }: { children?: React.ReactNode }) {
  return <h2 className="text-lg font-bold">{children}</h2>
}