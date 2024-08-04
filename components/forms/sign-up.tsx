"use client"

import { useRef, useState } from "react"
import InputField from "@/components/fields/input"
import PrimaryButton from "@/components/buttons/primary"

export default function SignUpForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)
  const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined)

  async function handleFormAction(formData: FormData) {
    setErrorMessage(undefined)
    setSuccessMessage(undefined)

    const data = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      passwordConfirmation: formData.get("passwordConfirmation") as string,
    }

    if (data.password !== data.passwordConfirmation) {
      return setErrorMessage("Passwords don't match")
    }

    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      })
    })

    if (response.ok) {
      formRef.current?.reset()
      return setSuccessMessage("Account created successfully")
    } else {
      const { error } = await response.json()
      return setErrorMessage(error)
    }
  }

  return (
    <form
      ref={formRef}
      action={handleFormAction}
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
      <div>{errorMessage && <p className="text-red-500">{errorMessage}</p>}</div>
      <div>{successMessage && <p className="text-green-500">{successMessage}</p>}</div>
      <PrimaryButton justify="justify-center" type="submit">Sign up</PrimaryButton>
    </form>
  )
}