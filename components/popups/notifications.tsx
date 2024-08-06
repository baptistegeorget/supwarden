"use client"

import InvitationsList from "@/components/lists/invitations"
import SecondaryButton from "@/components/buttons/secondary"
import { useEffect, useState } from "react"
import { Invitation } from "@/types"

export default function NotificationsPopup({
  onClose
}: {
  onClose: () => void
}) {
  const [invitations, setInvitations] = useState<Invitation[]>([])

  useEffect(() => {
    getInvitations()
  }, [])

  async function getInvitations() {
    const response = await fetch("/api/invitations", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (response.ok) {
      const { invitations }: { invitations: Invitation[] } = await response.json()
      return setInvitations(invitations)
    } else {
      return setInvitations([])
    }
  }

  async function respondToInvitation(invitationId: string, isAccepted: boolean) {
    const response = await fetch(`/api/invitations/${invitationId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isAccepted }),
    })

    if (response.ok) {
      getInvitations()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-black py-8 px-16 rounded-md shadow-lg border border-neutral-700 flex flex-col items-center gap-2">
        <p><b>Invitations list</b></p>
        <InvitationsList
          invitations={invitations}
          onSelect={respondToInvitation}
        />
        <SecondaryButton onClick={onClose}>Close</SecondaryButton>
      </div>
    </div>
  )
}