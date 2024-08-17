"use client"

import InputField from "@/components/fields/InputField"
import PrimaryButton from "@/components/buttons/PrimaryButton"
import { SessionResponse } from "@/types"

export default function FolderForm({
  session,
  onSuccess,
  onFailure
}: {
  session: SessionResponse,
  onSuccess?: (successMessage: string) => void,
  onFailure?: (errorMessage: string) => void
}) {
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)
    const body = Object.fromEntries(formData.entries())

    const response = await fetch(`/api/users/${session.user.id}/folders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    })

    if (response.ok) {
      const { message }: { message: string } = await response.json()

      form.reset()

      if (onSuccess) onSuccess(message)
    } else {
      const { error }: { error: string } = await response.json()
      
      if (onFailure) onFailure(error)
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-2 w-full items-center">
      <div className="flex gap-2 w-full">
        <InputField
          type="text"
          name="name"
          placeholder="Enter folder name"
          required
          minLength={1}
          maxLength={32}
        />
        <PrimaryButton type="submit">Add</PrimaryButton>
      </div>
    </form>
  )
}