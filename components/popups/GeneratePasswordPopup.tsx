"use client"

import SecondaryButton from "@/components/buttons/SecondaryButton"
import PasswordGenerator from "@/components/misc/PasswordGenerator"

export default function GeneratePasswordPopup({
  onClose,
}: {
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-black py-8 px-16 rounded-md shadow-lg border border-neutral-700 flex flex-col items-center gap-2">
        <h2 className="text-xl font-bold">Generate Password</h2>
        <PasswordGenerator />
        <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
      </div>
    </div>
  )
}