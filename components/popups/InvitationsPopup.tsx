import InvitationsList from "@/components/lists/InvitationsList"
import SecondaryButton from "@/components/buttons/SecondaryButton"
import { InvitationResponse } from "@/types"

export default function InvitationsPopup({
  invitations,
  onAccept,
  onReject,
  onClose
}: {
  invitations: InvitationResponse[],
  onAccept: (invitationId: string) => void,
  onReject: (invitationId: string) => void,
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-black py-8 px-16 rounded-md shadow-lg border border-neutral-700 flex flex-col items-center gap-2">
        <p><b>Invitations list</b></p>
        <InvitationsList invitations={invitations} onAccept={onAccept} onReject={onReject} />
        <SecondaryButton onClick={onClose}>Close</SecondaryButton>
      </div>
    </div>
  )
}