import InvitationsList from "@/components/lists/InvitationsList"
import SecondaryButton from "@/components/buttons/SecondaryButton"
import { InvitationResponse } from "@/types"
import { useEffect, useState } from "react"

export default function InvitationsPopup({
  onClose
}: {
  onClose?: () => void
}) {
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
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-black py-8 px-16 rounded-md shadow-lg border border-neutral-700 flex flex-col items-center gap-2">
      <h2 className="text-xl font-bold">Invitations list</h2>
        <InvitationsList invitations={invitations} onChange={getInvitations} />
        <SecondaryButton onClick={onClose}>Close</SecondaryButton>
      </div>
    </div>
  )
}