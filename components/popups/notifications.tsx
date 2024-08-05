import InvitationsList from "@/components/lists/invitations"
import SecondaryButton from "@/components/buttons/secondary"

export default function NotificationsPopup({
  onClose
}: {
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-black py-8 px-16 rounded-md shadow-lg border border-neutral-700 flex flex-col items-center gap-2">
        <p>Invitations list</p>
        <InvitationsList />
        <SecondaryButton onClick={onClose}>Close</SecondaryButton>
      </div>
    </div>
  )
}