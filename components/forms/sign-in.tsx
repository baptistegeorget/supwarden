"use client"

import { signIn } from "@/lib/auth"
import { useState } from "react"
import InputField from "@/components/fields/input"
import PrimaryButton from "@/components/buttons/primary"

export default function SignInForm() {
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)

  async function handleFormAction(formData: FormData) {
    try {
      setErrorMessage(undefined)
      await signIn(formData)
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message)
      }
    }
  }

  return (
    <form
      action={handleFormAction}
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
      <div>{errorMessage && <p className="text-red-500">{errorMessage}</p>}</div>
      <PrimaryButton justify="justify-center" type="submit">Sign in</PrimaryButton>
    </form>
  )
}