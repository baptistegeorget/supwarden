"use client"

import { EmailField, PasswordField, TextField } from "@/components/fields"
import { PrimaryButton } from "@/components/buttons"
import { useRef, useState } from "react"
import { getAuthToken } from "@/lib/auth"

export function FolderForm({ onSuccess }: { onSuccess: () => void }) {
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
        <TextField
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

export function InvitationForm({ folderId, onSuccess }: { folderId: string, onSuccess: () => void }) {
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
        <EmailField
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

export function ElementForm({
  folderId,
  onSuccess,
  elementId
}: {
  folderId: string,
  onSuccess: () => void,
  elementId?: string
}) {
  const formRef = useRef<HTMLFormElement>(null)
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)

  async function handleAction(formData: FormData) {

  }

  return (
    <form
      ref={formRef}
      action={handleAction}
      className="flex flex-col gap-2 w-full items-center"
    >
      <TextField
        label="Name"
        name="name"
        placeholder="Enter a name"
        required
        minLength={1}
        maxLength={32}
      />
      <TextField
        label="Identifier"
        name="identifier"
        placeholder="Enter an identifier"
        minLength={1}
        maxLength={32}
      />
      <PasswordField
        label="Password"
        name="password"
        placeholder="Enter a password"
        minLength={1}
        maxLength={32}
      />
      <TextField
        label="URLs"
        name="urls"
        placeholder="Separate URLs with commas"
        minLength={1}
        maxLength={4096}
      />
      <TextField
        label="Note"
        name="note"
        placeholder="Enter a note"
        minLength={1}
        maxLength={4096}
      />
      <div>{errorMessage && <p className="text-red-500">{errorMessage}</p>}</div>
      <PrimaryButton justify="justify-center" type="submit">Save</PrimaryButton>
    </form>
  )
}