"use client"

import { ElementResponse, FolderResponse, SessionResponse } from "@/types"
import { useState } from "react"
import { createPortal } from "react-dom"
import { useNotification } from "@/components/providers/NotificationProvider"

export default function ElementsPanel({
  session,
  folder,
  onSelectElement,
  onSelectNew,
  onSelectMessages,
  onSelectMembers
}: {
  session: SessionResponse,
  folder: FolderResponse,
  onSelectElement?: (element: ElementResponse) => void,
  onSelectNew?: () => void,
  onSelectMessages?: () => void,
  onSelectMembers?: () => void
}) {
  const notify = useNotification()
  const [isSendInvitationPopupVisible, setIsSendInvitationPopupVisible] = useState(false)

  async function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)
    const body = Object.fromEntries(formData.entries())

    const response = await fetch(`/api/users/${session.user.id}/folders/${folder.id}/send-invitation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    })

    if (response.ok) {
      const { message }: { message: string } = await response.json()
      notify(message, "success")
      form.reset()
    } else {
      const { error }: { error: string } = await response.json()
      notify(error, "error")
    }
  }

  return (
    <>
      <main className="p-8 flex-1">
        <div className="flex justify-between gap-2 items-center">
          <h2 className="text-xl font-bold">{folder.name}</h2>
          <div className="flex gap-2">
            {folder.type === "shared" && (
              <button onClick={() => setIsSendInvitationPopupVisible(true)}>
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.5 12a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11ZM4 12.999l8.81.001A6.478 6.478 0 0 0 11 17.5c0 1.087.267 2.112.739 3.013-1.05.35-2.208.487-3.239.487-2.722 0-6.335-.956-6.495-4.27L2 16.5v-1.501a2 2 0 0 1 2-2Zm13.5 1.003-.09.008a.5.5 0 0 0-.402.402l-.008.09V17h-2.5l-.09.008a.5.5 0 0 0-.402.402L14 17.5l.008.09a.5.5 0 0 0 .402.402l.09.008H17v2.5l.008.09a.5.5 0 0 0 .402.402l.09.008.09-.008a.5.5 0 0 0 .402-.402L18 20.5V18h2.5l.09-.008a.5.5 0 0 0 .402-.402L21 17.5l-.008-.09a.5.5 0 0 0-.402-.402L20.5 17H18v-2.498l-.008-.09a.5.5 0 0 0-.402-.402l-.09-.008ZM8.5 2a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Zm9 2a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Z" fill="#ffffff" /></svg>
              </button>
            )}
            <button onClick={onSelectMembers}>
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m3.5 14 10 .001a1.5 1.5 0 0 1 1.493 1.356L15 15.5V17.5C14.999 21 11.284 22 8.5 22c-2.722 0-6.335-.956-6.495-4.27L2 17.5v-2a1.5 1.5 0 0 1 1.356-1.493L3.5 14Zm11.988 0H20.5a1.5 1.5 0 0 1 1.493 1.355L22 15.5V17c-.001 3.062-2.858 4-5 4a7.16 7.16 0 0 1-2.14-.322c.653-.75 1.076-1.703 1.133-2.898L16 17.5v-2c0-.494-.15-.951-.399-1.338L15.488 14H20.5h-5.012ZM8.5 3a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Zm9 2a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Z" fill="#ffffff" /></svg>
            </button>
            <button onClick={onSelectMessages}>
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10a9.96 9.96 0 0 1-4.644-1.142l-4.29 1.117a.85.85 0 0 1-1.037-1.036l1.116-4.289A9.959 9.959 0 0 1 2 12C2 6.477 6.477 2 12 2Zm1.252 11H8.75l-.102.007a.75.75 0 0 0 0 1.486l.102.007h4.502l.101-.007a.75.75 0 0 0 0-1.486L13.252 13Zm1.998-3.5h-6.5l-.102.007a.75.75 0 0 0 0 1.486L8.75 11h6.5l.102-.007a.75.75 0 0 0 0-1.486L15.25 9.5Z" fill="#ffffff" /></svg>
            </button>
            <button onClick={onSelectNew}>
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11.883 3.007 12 3a1 1 0 0 1 .993.883L13 4v7h7a1 1 0 0 1 .993.883L21 12a1 1 0 0 1-.883.993L20 13h-7v7a1 1 0 0 1-.883.993L12 21a1 1 0 0 1-.993-.883L11 20v-7H4a1 1 0 0 1-.993-.883L3 12a1 1 0 0 1 .883-.993L4 11h7V4a1 1 0 0 1 .883-.993L12 3l-.117.007Z" fill="#ffffff" /></svg>
            </button>
          </div>
        </div>
      </main>
      {isSendInvitationPopupVisible && createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-black p-8 rounded border border-neutral-700 flex flex-col gap-2 items-center w-96 justify-between">
            <h2 className="text-xl font-bold">Send invitation</h2>
            <form onSubmit={submitForm} className="flex gap-2 items-center w-full">
              <input type="email" name="email" placeholder="Enter the user email..." className="px-2 py-1 rounded bg-transparent border border-neutral-700 w-full" required />
              <button type="submit" className="px-2 py-1 rounded bg-white text-black">Send</button>
            </form>
            <button onClick={() => setIsSendInvitationPopupVisible(false)} className="px-2 py-1 rounded bg-transparent border border-neutral-700 text-white">Close</button>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}