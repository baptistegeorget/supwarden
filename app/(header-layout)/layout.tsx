import { Header } from "@/components/header"

export default function HeaderLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Header />
      {children}
    </>
  )
}
