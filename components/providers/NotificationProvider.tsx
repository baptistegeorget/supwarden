"use client"

import { createContext, ReactNode, useCallback, useContext, useState } from "react"
import { createPortal } from "react-dom"

const NotificationContext = createContext<(
  message: string,
  type?: "info" | "success" | "warning" | "error",
  duration?: number
) => void>(() => {
  throw new Error("Notification provider not found")
})

export default function NotificationProvider({ children }: { children: ReactNode }) {
  const [notification, setNotification] = useState<{ message: string; type: "info" | "success" | "warning" | "error" } | null>(null)

  const notify = useCallback((message: string, type: "info" | "success" | "warning" | "error" = "info", duration: number = 3000) => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, duration)
  }, [])

  return (
    <NotificationContext.Provider value={notify}>
      {children}
      {notification &&
        createPortal(
          <div className={`fixed top-2 left-1/2 transform -translate-x-1/2 rounded-md py-2 px-4 ${notification.type === "info" ? "bg-blue-500 text-white" : notification.type === "success" ? "bg-green-500 text-white" : notification.type === "warning" ? "bg-yellow-500 text-black" : "bg-red-500 text-white"}`}>
            <p>{notification.message}</p>
          </div>,
          document.body
        )
      }
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  return useContext(NotificationContext)
}