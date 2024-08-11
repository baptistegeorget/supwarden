"use client"

import { signIn } from "@/lib/auth"
import InputField from "@/components/fields/input"
import PrimaryButton from "@/components/buttons/primary"

export default function SignInForm({
  onSuccess,
  onFailure
}: {
  onSuccess?: () => void
  onFailure?: (error: string) => void
}) {
  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault()
        const form = event.currentTarget
        const formData = new FormData(form)
        try {
          await signIn(formData)
          form.reset()
          if (onSuccess) {
            onSuccess()
          }
        } catch (error) {
          if (error instanceof Error) {
            if (onFailure) {
              onFailure(error.message)
            }
          }
        }
      }}
      className="flex flex-col gap-2 w-full items-center"
    >
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
      <PrimaryButton justify="justify-center" type="submit">Sign in</PrimaryButton>
    </form>
  )
}