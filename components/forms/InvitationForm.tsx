"use client"

import InputField from "@/components/fields/InputField"
import PrimaryButton from "@/components/buttons/PrimaryButton"

export default function InvitationForm({
  folderId,
  onSuccess,
  onFailure
}: {
  folderId: string,
  onSuccess?: () => void,
  onFailure?: (error: string) => void
}) {
  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault()
        const form = event.currentTarget
        const formData = new FormData(form)
        const body = Object.fromEntries(formData.entries())
        const response = await fetch(`/api/invitations?folderId=${folderId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body)
        })
        if (response.ok) {
          form.reset()
          if (onSuccess) {
            onSuccess()
          }
        } else {
          const { error } = await response.json()
          if (onFailure) {
            onFailure(error)
          }
        }
      }}
      className="flex flex-col gap-2 w-full items-center"
    >
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