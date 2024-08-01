"use client"

import { getAuthToken } from "@/lib/auth"
import { useRef, useState } from "react"
import InputField from "@/components/fields/input"
import PrimaryButton from "@/components/buttons/primary"

export default function FolderForm({ onSuccess }: { onSuccess: () => void }) {
  const formRef = useRef<HTMLFormElement>(null)
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)

  async function handleAction(formData: FormData) {
    setErrorMessage(undefined)

    const data = {
      name: formData.get("folderName") as string,
    }

    const authToken = await getAuthToken()

    if (!authToken) {
      return setErrorMessage("Unauthorized")
    }

    const response = await fetch("/api/folders", {
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
      <div className="flex gap-2 w-full">
        <InputField
          type="text"
          name="folderName"
          placeholder="Enter folder name"
          required
          minLength={1}
          maxLength={32}
        />
        <PrimaryButton justify="justify-center" type="submit">Add</PrimaryButton>
      </div>
      <div>{errorMessage && <p className="text-red-500">{errorMessage}</p>}</div>
    </form>
  )
}