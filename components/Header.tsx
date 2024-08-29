"use client"

import Link from "next/link"
import { InvitationResponse, SessionResponse } from "@/types"
import { signOut } from "@/lib/auth"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { useNotification } from "@/components/NotificationProvider"

export default function Header({
  session
}: {
  session: SessionResponse
}) {
  const notify = useNotification()
  const [invitations, setInvitations] = useState<InvitationResponse[]>([])
  const [isInvitationsPopupVisible, setIsInvitationsPopupVisible] = useState(false)

  useEffect(() => {
    fetchInvitations(session.user.id)
  }, [session])

  async function fetchInvitations(userId: string) {
    const response = await fetch(`/api/users/${userId}/invitations`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })

    if (response.ok) {
      const { invitations }: { invitations: InvitationResponse[] } = await response.json()
      setInvitations(invitations)
    } else {
      setInvitations([])
    }
  }

  async function replyToInvitation(userId: string, invitationId: string, isAccepted: boolean) {
    const response = await fetch(`/api/users/${userId}/invitations/${invitationId}/reply`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        isAccepted
      })
    })

    if (response.ok) {
      const { message }: { message: string } = await response.json()
      notify(message, "success")
      fetchInvitations(userId)
    } else {
      const { error }: { error: string } = await response.json()
      notify(error, "error")
    }
  }

  return (
    <>
      <header className="flex border-b border-neutral-700 items-center px-8 py-4 justify-between">
        <Link href="/"><h1 className="text-center text-2xl font-bold">SUPWARDEN</h1></Link>
        <div className="flex gap-2">
          <p>{session.user.name}</p>
          <button onClick={() => signOut()}>
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 4.354v6.651l7.442-.001L17.72 9.28a.75.75 0 0 1-.073-.976l.073-.084a.75.75 0 0 1 .976-.073l.084.073 2.997 2.997a.75.75 0 0 1 .073.976l-.073.084-2.996 3.004a.75.75 0 0 1-1.134-.975l.072-.085 1.713-1.717-7.431.001L12 19.25a.75.75 0 0 1-.88.739l-8.5-1.502A.75.75 0 0 1 2 17.75V5.75a.75.75 0 0 1 .628-.74l8.5-1.396a.75.75 0 0 1 .872.74ZM8.502 11.5a1.002 1.002 0 1 0 0 2.004 1.002 1.002 0 0 0 0-2.004Z" fill="#ffffff" /><path d="M13 18.501h.765l.102-.006a.75.75 0 0 0 .648-.745l-.007-4.25H13v5.001ZM13.002 10 13 8.725V5h.745a.75.75 0 0 1 .743.647l.007.102.007 4.251h-1.5Z" fill="#ffffff" /></svg>
          </button>
          <button onClick={() => setIsInvitationsPopupVisible(true)}>
            {invitations.length <= 0 && (
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22 8.608v8.142a3.25 3.25 0 0 1-3.066 3.245L18.75 20H5.25a3.25 3.25 0 0 1-3.245-3.066L2 16.75V8.608l9.652 5.056a.75.75 0 0 0 .696 0L22 8.608ZM5.25 4h13.5a3.25 3.25 0 0 1 3.234 2.924L12 12.154l-9.984-5.23a3.25 3.25 0 0 1 3.048-2.919L5.25 4h13.5-13.5Z" fill="#ffffff" /></svg>
            )}
            {invitations.length > 0 && (
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m2 9.11 8.65 4.554a.75.75 0 0 0 .7 0l7.206-3.793a3.503 3.503 0 0 0 1.445.093L20 16.75a3.25 3.25 0 0 1-3.066 3.245L16.75 20H5.25a3.25 3.25 0 0 1-3.245-3.066L2 16.75V9.11ZM16.337 5A3.486 3.486 0 0 0 16 6.5a3.49 3.49 0 0 0 1.03 2.48L11 12.152 2.095 7.466a3.252 3.252 0 0 1 2.966-2.46L5.25 5h11.087ZM19.5 4a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z" fill="#ffffff" /></svg>
            )}
          </button>
          <Link href="/settings"><svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12.012 2.25c.734.008 1.465.093 2.182.253a.75.75 0 0 1 .582.649l.17 1.527a1.384 1.384 0 0 0 1.927 1.116l1.401-.615a.75.75 0 0 1 .85.174 9.792 9.792 0 0 1 2.204 3.792.75.75 0 0 1-.271.825l-1.242.916a1.381 1.381 0 0 0 0 2.226l1.243.915a.75.75 0 0 1 .272.826 9.797 9.797 0 0 1-2.204 3.792.75.75 0 0 1-.848.175l-1.407-.617a1.38 1.38 0 0 0-1.926 1.114l-.169 1.526a.75.75 0 0 1-.572.647 9.518 9.518 0 0 1-4.406 0 .75.75 0 0 1-.572-.647l-.168-1.524a1.382 1.382 0 0 0-1.926-1.11l-1.406.616a.75.75 0 0 1-.849-.175 9.798 9.798 0 0 1-2.204-3.796.75.75 0 0 1 .272-.826l1.243-.916a1.38 1.38 0 0 0 0-2.226l-1.243-.914a.75.75 0 0 1-.271-.826 9.793 9.793 0 0 1 2.204-3.792.75.75 0 0 1 .85-.174l1.4.615a1.387 1.387 0 0 0 1.93-1.118l.17-1.526a.75.75 0 0 1 .583-.65c.717-.159 1.45-.243 2.201-.252ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" fill="#ffffff" /></svg></Link>
        </div>
      </header>
      {isInvitationsPopupVisible && createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-black p-8 rounded border border-neutral-700 flex flex-col gap-4 items-center min-w-96 justify-between">
            <h2 className="text-xl font-bold">Invitations</h2>
            {invitations.length <= 0 && (
              <p className="text-neutral-700">No invitations</p>
            )}
            {invitations.length > 0 && (
              <div className="flex flex-col gap-1 overflow-auto scrollbar-thin max-h-96">
                {invitations.map((invitation) => (
                  <div key={invitation.id} className="flex gap-2 items-center">
                    <p><b>{invitation.createdBy.name}</b> invited you to join <b>{invitation.folder.name}</b></p>
                    <button onClick={() => replyToInvitation(session.user.id, invitation.id, true)}>
                      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m8.5 16.586-3.793-3.793a1 1 0 0 0-1.414 1.414l4.5 4.5a1 1 0 0 0 1.414 0l11-11a1 1 0 0 0-1.414-1.414L8.5 16.586Z" fill="#ffffff" /></svg>
                    </button>
                    <button onClick={() => replyToInvitation(session.user.id, invitation.id, false)}>
                      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m4.21 4.387.083-.094a1 1 0 0 1 1.32-.083l.094.083L12 10.585l6.293-6.292a1 1 0 1 1 1.414 1.414L13.415 12l6.292 6.293a1 1 0 0 1 .083 1.32l-.083.094a1 1 0 0 1-1.32.083l-.094-.083L12 13.415l-6.293 6.292a1 1 0 0 1-1.414-1.414L10.585 12 4.293 5.707a1 1 0 0 1-.083-1.32l.083-.094-.083.094Z" fill="#ffffff" /></svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => setIsInvitationsPopupVisible(false)} className="px-2 py-1 rounded bg-transparent border border-neutral-700 text-white">Close</button>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}