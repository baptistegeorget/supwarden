"use client"

import InvitationsPopup from "@/components/popups/InvitationsPopup"
import { InvitationResponse } from "@/types"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { useNotification } from "../providers/NotificationProvider"

export default function InvitationsPopupButton() {
  const notify = useNotification()
  const [isNotificationPopupVisible, setIsNotificationPopupVisible] = useState(false)
  const [invitations, setInvitations] = useState<InvitationResponse[]>([])

  useEffect(() => {
    getInvitations()
  }, [])

  async function getInvitations() {
    const response = await fetch("/api/invitations", {
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

  async function patchInvitation(invitationId: string, status: "accepted" | "rejected") {
    const response = await fetch(`/api/invitations?status=${status}&invitationId=${invitationId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      }
    })
    if (response.ok) {
      getInvitations()
      notify(`Invitation ${status}`, "success")
    } else {
      notify(`Failed to update ${status}`, "error")
    }
  }

  return (
    <>
      <button
        onClick={() => {
          getInvitations()
          setIsNotificationPopupVisible(true)
        }}
      >
        {invitations.length > 0 ?
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M23 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0Zm-8-1v.882l-.447.894A.5.5 0 0 0 15 8h5a.5.5 0 0 0 .447-.724L20 6.382V5.5a2.5 2.5 0 0 0-5 0Zm2.5 4.5a1.5 1.5 0 0 0 1.415-1h-2.83a1.5 1.5 0 0 0 1.415 1Zm0 3a6.478 6.478 0 0 0 4.5-1.81v5.56a3.25 3.25 0 0 1-3.066 3.245L18.75 20H5.25a3.25 3.25 0 0 1-3.245-3.066L2 16.75V8.608l9.652 5.056a.75.75 0 0 0 .696 0l2.417-1.266A6.477 6.477 0 0 0 17.5 13ZM5.25 4h6.248A6.479 6.479 0 0 0 11 6.5c0 1.993.897 3.776 2.308 4.968L12 12.153l-9.984-5.23a3.25 3.25 0 0 1 3.048-2.918L5.25 4Z" fill="#ffffff" /></svg> :
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22 8.608v8.142a3.25 3.25 0 0 1-3.066 3.245L18.75 20H5.25a3.25 3.25 0 0 1-3.245-3.066L2 16.75V8.608l9.652 5.056a.75.75 0 0 0 .696 0L22 8.608ZM5.25 4h13.5a3.25 3.25 0 0 1 3.234 2.924L12 12.154l-9.984-5.23a3.25 3.25 0 0 1 3.048-2.919L5.25 4h13.5-13.5Z" fill="#ffffff" /></svg>
        }
      </button>
      {isNotificationPopupVisible &&
        createPortal(
          <InvitationsPopup
            invitations={invitations}
            onAccept={async (invitationId: string) => patchInvitation(invitationId, "accepted")}
            onReject={async (invitationId: string) => patchInvitation(invitationId, "rejected")}
            onClose={() => setIsNotificationPopupVisible(false)}
          />,
          document.body
        )
      }
    </>
  )
}