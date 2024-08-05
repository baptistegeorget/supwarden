"use client"

import { useRef, useState } from "react"
import InputField from "@/components/fields/input"
import PrimaryButton from "@/components/buttons/primary"

export default function InvitationForm({
  folderId,
  onSuccess
}: {
  folderId: string,
  onSuccess: () => void
}) {
  const formRef = useRef<HTMLFormElement>(null)
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)
  const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined)

  async function handleFormAction(formData: FormData) {
    setErrorMessage(undefined)
    setSuccessMessage(undefined)

    const data = {
      email: formData.get("email") as string,
      folderId,
    }

    const response = await fetch("/api/invitations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    })

    if (response.ok) {
      formRef.current?.reset()
      setSuccessMessage("Invitation sent successfully")
      onSuccess()
    } else {
      const { error } = await response.json()
      return setErrorMessage(error)
    }
  }

  return (
    <form
      ref={formRef}
      action={handleFormAction}
      className="flex flex-col gap-2 w-full items-center"
    >
      <div className="flex gap-2">
        <InputField
          type="email"
          name="email"
          placeholder="Enter user email"
          required
        />
        <PrimaryButton justify="justify-center" type="submit">Send</PrimaryButton>
      </div>
      <div>{errorMessage && <p className="text-red-500">{errorMessage}</p>}</div>
      <div>{successMessage && <p className="text-green-500">{successMessage}</p>}</div>
    </form>
  )
}