"use client"

import SecondaryButton from "@/components/buttons/SecondaryButton"
import InvitationForm from "@/components/forms/InvitationForm"
import { useNotification } from "../providers/NotificationProvider"

export default function InvitationFormPopup({
  folderId,
  onClose
}: {
  folderId: string,
  onClose?: () => void
}) {
  const notify = useNotification()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-black py-8 px-16 rounded-md shadow-lg border border-neutral-700 flex flex-col items-center gap-2">
        <h2 className="text-xl font-bold">Send invitation</h2>
        <InvitationForm
          folderId={folderId}
          onSuccess={() => {
            notify("Invitation sent", "success")
            if (onClose) onClose()
          }}
          onFailure={(error) => notify(error, "error")}
        />
        <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
      </div>
    </div>
  )
}