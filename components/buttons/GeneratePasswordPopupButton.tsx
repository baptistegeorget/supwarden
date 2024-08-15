"use client"

import { useState } from "react"
import { createPortal } from "react-dom"
import GeneratePasswordPopup from "@/components/popups/GeneratePasswordPopup"
import TertiaryButton from "@/components/buttons/TertiaryButton"

export default function GeneratePasswordPopupButton() {
  const [isGeneratePasswordPopupVisible, setIsGeneratePasswordPopupVisible] = useState(false)

  return (
    <>
      <TertiaryButton type="button" onClick={() => setIsGeneratePasswordPopupVisible(true)}>Generate password</TertiaryButton>
      {isGeneratePasswordPopupVisible &&
        createPortal(
          <GeneratePasswordPopup onClose={() => setIsGeneratePasswordPopupVisible(false)} />,
          document.body
        )}
    </>
  )
}