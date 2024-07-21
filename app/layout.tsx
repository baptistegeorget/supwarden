import "./globals.css"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="h-screen w-full bg-black text-white flex flex-col">
        {children}
      </body>
    </html>
  )
}
