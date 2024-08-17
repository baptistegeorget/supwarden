"use client"

import PrimaryButton from "@/components/buttons/PrimaryButton"
import InvitationFormPopup from "@/components/InvitationFormPopup"
import { SessionResponse } from "@/types"
import { useState } from "react"
import { createPortal } from "react-dom"

export default function InvitationFormPopupButton({
  session,
  folderId
}: {
  session: SessionResponse,
  folderId: string
}) {
  const [isInvitationFormPopupVisible, setIsInvitationFormPopupVisible] = useState(false)

  return (
    <>
      <PrimaryButton type="button" onClick={() => setIsInvitationFormPopupVisible(true)}>Share</PrimaryButton>
      {isInvitationFormPopupVisible &&
        createPortal(
          <InvitationFormPopup
            session={session}
            folderId={folderId}
            onClose={() => setIsInvitationFormPopupVisible(false)}
          />,
          document.body
        )}
    </>
  )
}