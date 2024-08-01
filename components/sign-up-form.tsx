import { useRouter } from "next/navigation"
import { useState } from "react"
import { EmailField, PasswordField, TextField } from "@/components/fields"
import { PrimaryButton } from "@/components/buttons"

export default function SignUpForm() {
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)

  async function handleAction(formData: FormData) {
    setErrorMessage(undefined)

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
      router.push("/signin")
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
      <TextField
        label="First name"
        name="firstName"
        placeholder="Enter your first name"
        required
        minLength={1}
        maxLength={32}
      />
      <TextField
        label="Last name"
        name="lastName"
        placeholder="Enter your last name"
        required
        minLength={1}
        maxLength={32}
      />
      <EmailField
        label="Email"
        name="email"
        placeholder="Enter your email"
        required
      />
      <PasswordField
        label="Password"
        name="password"
        placeholder="Enter your password"
        required
        minLength={8}
        maxLength={32}
      />
      <PasswordField
        label="Confirm password"
        name="passwordConfirmation"
        placeholder="Re-enter your password"
        required
        minLength={8}
        maxLength={32}
      />
      <div>{errorMessage && <p className="text-red-500">{errorMessage}</p>}</div>
      <PrimaryButton justify="justify-center" type="submit">Sign up</PrimaryButton>
    </form>
  )
}