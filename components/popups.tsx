"use client"

import InvitationForm from "@/components/forms/invitation"
import SecondaryButton from "@/components/buttons/secondary"
import { InvitationsList } from "@/components/lists"
import { useEffect, useState } from "react"
import { WithId } from "mongodb"
import { Invitation } from "@/types"
import { getAuthToken } from "@/lib/auth"

export function SendInvitationsPopup({
  isVisible,
  onClose,
  folderId
}: {
  isVisible: boolean,
  onClose: () => void,
  folderId: string
}) {
  if (!isVisible) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-black py-8 px-16 rounded-md shadow-lg border border-neutral-700 flex flex-col items-center gap-2">
        <InvitationForm folderId={folderId} onSuccess={onClose} />
        <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
      </div>
    </div>
  )
}

export function NotificationsPopup({
  isVisible,
  onClose
}: {
  isVisible: boolean,
  onClose: () => void
}) {
  const [invitations, setInvitations] = useState<WithId<Invitation>[]>([])

  useEffect(() => {
    getInvitations()
  }, [])

  if (!isVisible) {
    return null
  }

  async function getInvitations() {
    const authToken = await getAuthToken()

    if (!authToken) {
      return setInvitations([])
    }
    
    const response = await fetch("/api/invitations", {
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken
      }
    })
    
    if (response.ok) {
      const result = await response.json()
      return setInvitations(result.invitations)
    } else {
      return setInvitations([])
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-black py-8 px-16 rounded-md shadow-lg border border-neutral-700 flex flex-col items-center gap-2">
        {invitations.length === 0 && <span>No notifications</span>}
        <InvitationsList invitations={invitations} onChange={getInvitations} />
        <SecondaryButton onClick={onClose}>Close</SecondaryButton>
      </div>
    </div>
  )
}