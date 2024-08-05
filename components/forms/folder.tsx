"use client"

import { useRef, useState } from "react"
import InputField from "@/components/fields/input"
import PrimaryButton from "@/components/buttons/primary"

export default function FolderForm({
  onSuccess
}: {
  onSuccess: () => void
}) {
  const formRef = useRef<HTMLFormElement>(null)
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)
  const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined)

  async function handleFormAction(formData: FormData) {
    setErrorMessage(undefined)
    setSuccessMessage(undefined)

    const data = {
      name: formData.get("name") as string,
    }

    const response = await fetch("/api/folders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    })

    if (response.ok) {
      formRef.current?.reset()
      setSuccessMessage("Folder added successfully")
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
      <div className="flex gap-2 w-full">
        <InputField
          type="text"
          name="name"
          placeholder="Enter folder name"
          required
          minLength={1}
          maxLength={32}
        />
        <PrimaryButton justify="justify-center" type="submit">Add</PrimaryButton>
      </div>
      <div>{errorMessage && <p className="text-red-500">{errorMessage}</p>}</div>
      <div>{successMessage && <p className="text-green-500">{successMessage}</p>}</div>
    </form>
  )
}