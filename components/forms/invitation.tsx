"use client"

import { getAuthToken } from "@/lib/auth"
import { useRef, useState } from "react"
import InputField from "@/components/fields/input"
import PrimaryButton from "@/components/buttons/primary"

export default function InvitationForm({ folderId, onSuccess }: { folderId: string, onSuccess: () => void }) {
  const formRef = useRef<HTMLFormElement>(null)
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)

  async function handleAction(formData: FormData) {
    setErrorMessage(undefined)

    const data = {
      email: formData.get("email") as string,
      folderId,
    }

    const authToken = await getAuthToken()

    if (!authToken) {
      return setErrorMessage("Unauthorized")
    }

    const response = await fetch("/api/invitations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken
      },
      body: JSON.stringify(data)
    })

    if (response.ok) {
      formRef.current?.reset()
      onSuccess()
    } else {
      const result = await response.json()
      return setErrorMessage(result.error)
    }
  }

  return (
    <form
      ref={formRef}
      action={handleAction}
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
    </form>
  )
}