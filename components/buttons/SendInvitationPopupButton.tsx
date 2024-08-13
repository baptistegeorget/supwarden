"use client"

import PrimaryButton from "@/components/buttons/PrimaryButton"
import InvitationFormPopup from "@/components/popups/InvitationFormPopup"
import { useState } from "react"
import { createPortal } from "react-dom"

export default function SendInvitationPopupButton({
  folderId
}: {
  folderId: string
}) {
  const [isInvitationFormPopupVisible, setIsInvitationFormPopupVisible] = useState(false)

  return (
    <>
      <PrimaryButton onClick={() => setIsInvitationFormPopupVisible(true)}>Share</PrimaryButton>
      {isInvitationFormPopupVisible &&
        createPortal(
          <InvitationFormPopup
            onClose={() => setIsInvitationFormPopupVisible(false)}
            folderId={folderId}
          />,
          document.body
        )}
    </>
  )
}