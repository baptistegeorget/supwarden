"use client"

import { setAuthToken } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { useState } from "react"
import InputField from "@/components/fields/input"
import PrimaryButton from "@/components/buttons/primary"

export default function SignInForm() {
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)

  async function handleAction(formData: FormData) {
    setErrorMessage(undefined)

    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    }

    const response = await fetch("/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    })

    if (response.ok) {
      const result = await response.json()
      await setAuthToken(result.token)
      router.push("/")
    } else {
      const result = await response.json()
      return setErrorMessage(result.error)
    }
  }

  return (
    <form
      action={handleAction}
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