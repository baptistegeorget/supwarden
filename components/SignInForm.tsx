"use client"

import InputField from "@/components/fields/InputField"
import PrimaryButton from "@/components/buttons/PrimaryButton"

export default function SignInForm({
  onSuccess,
  onFailure
}: {
  onSuccess?: (successMessage: string) => void
  onFailure?: (errorMessage: string) => void
}) {
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)
    const body = Object.fromEntries(formData.entries())

    const response = await fetch("/api/auth", {
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
      <InputField
        type="email"
        label="Email"
        name="email"
        placeholder="Enter your email"
        required
      />
      <InputField
        type="password"
        label="Password"
        name="password"
        placeholder="Enter your password"
        required
        minLength={8}
        maxLength={32}
      />
      <PrimaryButton type="submit">Sign in</PrimaryButton>
    </form>
  )
}