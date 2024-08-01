"use client"

import { NotificationsPopup } from "@/components/popups"
import { useState } from "react"

export default function NotificationButton() {
  const [isNotificationPopupVisible, setIsNotificationPopupVisible] = useState(false)

  return (
    <>
      <button onClick={() => setIsNotificationPopupVisible(true)}>
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9.042 19.003h5.916a3 3 0 0 1-5.916 0Zm2.958-17a7.5 7.5 0 0 1 7.5 7.5v4l1.418 3.16A.95.95 0 0 1 20.052 18h-16.1a.95.95 0 0 1-.867-1.338l1.415-3.16V9.49l.005-.25A7.5 7.5 0 0 1 12 2.004Z" fill="#ffffff" /></svg>
      </button>
      <NotificationsPopup isVisible={isNotificationPopupVisible} onClose={() => setIsNotificationPopupVisible(false)} />
    </>
  )
}