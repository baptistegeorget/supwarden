"use client"

import SecondaryButton from "@/components/buttons/SecondaryButton"
import InvitationForm from "@/components/InvitationForm"
import { useNotification } from "@/components/providers/NotificationProvider"
import { SessionResponse } from "@/types"

export default function InvitationFormPopup({
  session,
  folderId,
  onClose
}: {
  session: SessionResponse,
  folderId: string,
  onClose?: () => void
}) {
  const notify = useNotification()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-black py-8 px-16 rounded-md shadow-lg border border-neutral-700 flex flex-col items-center gap-2">
        <h2 className="text-xl font-bold">Send invitation</h2>
        <InvitationForm
          session={session}
          folderId={folderId}
          onSuccess={(successMessage) => notify(successMessage, "success")}
          onFailure={(errorMessage) => notify(errorMessage, "error")}
        />
        <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
      </div>
    </div>
  )
}