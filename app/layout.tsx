import NotificationProvider from "@/components/providers/NotificationProvider"
import "./globals.css"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <NotificationProvider>
      <html lang="en" className="h-full w-full">
        <body className="h-full w-full bg-black text-white flex flex-col">
          {children}
        </body>
      </html>
    </NotificationProvider>
  )
}
