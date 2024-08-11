"use client"

import InputField from "@/components/fields/input"
import PrimaryButton from "@/components/buttons/primary"

export default function FolderForm({
  onSuccess,
  onFailure
}: {
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
        const response = await fetch("/api/folders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
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
    </form>
  )
}