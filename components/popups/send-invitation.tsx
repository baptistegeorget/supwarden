import SecondaryButton from "@/components/buttons/secondary"
import InvitationForm from "@/components/forms/invitation"

export default function SendInvitationsPopup({
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
        <InvitationForm folderId={folderId} onSuccess={() => {}} />
        <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
      </div>
    </div>
  )
}