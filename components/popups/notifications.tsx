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

  async function acceptInvitation(invitationId: string) {

  }

  async function refuseInvitation(invitationId: string) {

  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-black py-8 px-16 rounded-md shadow-lg border border-neutral-700 flex flex-col items-center gap-2">
        <p><b>Invitations list</b></p>
        <InvitationsList
          invitations={invitations}
          onSelect={(invitationId, isAccepted) => isAccepted ? acceptInvitation(invitationId) : refuseInvitation(invitationId)}
        />
        <SecondaryButton onClick={onClose}>Close</SecondaryButton>
      </div>
    </div>
  )
}