"use client"

import InputField from "@/components/fields/InputField"
import PrimaryButton from "@/components/buttons/PrimaryButton"

export default function SignUpForm({
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
        const body = Object.fromEntries(formData.entries())
        const response = await fetch("/api/users", {
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
      <InputField
        type="text"
        label="First name"
        name="firstName"
        placeholder="Enter your first name"
        required
        minLength={1}
        maxLength={32}
      />
      <InputField
        type="text"
        label="Last name"
        name="lastName"
        placeholder="Enter your last name"
        required
        minLength={1}
        maxLength={32}
      />
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
      <InputField
        type="password"
        label="Confirm password"
        name="passwordConfirmation"
        placeholder="Re-enter your password"
        required
        minLength={8}
        maxLength={32}
      />
      <PrimaryButton type="submit">Sign up</PrimaryButton>
    </form>
  )
}