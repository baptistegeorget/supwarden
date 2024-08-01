"use client"

import { useRef, useState } from "react"
import InputField from "@/components/fields/input"
import TextAreaField from "@/components/fields/textarea"
import PrimaryButton from "@/components/buttons/primary"

export default function ElementForm({
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
      <InputField
        type="text"
        label="Name"
        name="name"
        placeholder="Enter a name"
        required
        minLength={1}
        maxLength={32}
      />
      <InputField
        type="text"
        label="Identifier"
        name="identifier"
        placeholder="Enter an identifier"
        minLength={1}
        maxLength={32}
      />
      <InputField
        type="password"
        label="Password"
        name="password"
        placeholder="Enter a password"
        minLength={1}
        maxLength={32}
      />
      <InputField
        type="text"
        label="URLs"
        name="urls"
        placeholder="Separate URLs with semicolon"
        minLength={1}
        maxLength={4096}
      />
      <TextAreaField
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