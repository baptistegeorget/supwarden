import NotificationProvider from "@/components/NotificationProvider"
import "./globals.css"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <NotificationProvider>
      <html lang="en" className="h-full w-full min-w-[72rem]">
        <body className="h-full w-full bg-black text-white flex flex-col">
          {children}
        </body>
      </html>
    </NotificationProvider>
  )
}
