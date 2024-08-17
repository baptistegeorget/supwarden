"use client"

import InputField from "@/components/fields/InputField"
import PrimaryButton from "@/components/buttons/PrimaryButton"
import { SessionResponse } from "@/types"

export default function InvitationForm({
  session,
  folderId,
  onSuccess,
  onFailure
}: {
  session: SessionResponse,
  folderId: string,
  onSuccess?: (successMessage: string) => void,
  onFailure?: (errorMessage: string) => void
}) {
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)
    const body = Object.fromEntries(formData.entries())

    const response = await fetch(`/api/users/${session.user.id}/folders/${folderId}/send-invitation`, {
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
      <div className="flex gap-2">
        <InputField
          type="email"
          name="email"
          placeholder="Enter user email"
          required
        />
        <PrimaryButton type="submit">Send</PrimaryButton>
      </div>
    </form>
  )
}