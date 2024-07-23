"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function SignUpPage() {
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)

  const router = useRouter()

  async function handleSignUpForm(formData: FormData) {
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
    <main className="flex-1 flex flex-col justify-center items-center">
      <div className="rounded-md shadow-lg py-8 px-16 flex flex-col gap-4 border border-neutral-700">
        <h1 className="text-center text-2xl">SUPWARDEN</h1>
        <form
          className="flex flex-col gap-2 w-full items-center"
          action={handleSignUpForm}
        >
          <div className="w-full flex flex-col gap-1">
            <p>*First name</p>
            <input
              type="text"
              name="firstName"
              required={true}
              minLength={1}
              maxLength={32}
              placeholder="Enter your first name"
              className="py-1 px-2 rounded w-full border border-neutral-700 bg-transparent"
            />
          </div>
          <div className="w-full flex flex-col gap-1">
            <p>*Last name</p>
            <input
              type="text"
              name="lastName"
              required={true}
              minLength={1}
              maxLength={32}
              placeholder="Enter your last name"
              className="py-1 px-2 rounded w-full border border-neutral-700 bg-transparent"
            />
          </div>
          <div className="w-full flex flex-col gap-1">
            <p>*Email</p>
            <input
              type="email"
              name="email"
              required={true}
              minLength={1}
              placeholder="Enter your email"
              className="py-1 px-2 rounded w-full border border-neutral-700 bg-transparent"
            />
          </div>
          <div className="w-full flex flex-col gap-1">
            <p>*Password</p>
            <input
              type="password"
              name="password"
              required={true}
              minLength={8}
              maxLength={32}
              placeholder="Enter your password"
              className="py-1 px-2 rounded w-full border border-neutral-700 bg-transparent"
            />
          </div>
          <div className="w-full flex flex-col gap-1">
            <p>*Password confirmation</p>
            <input
              type="password"
              name="passwordConfirmation"
              required={true}
              minLength={8}
              maxLength={32}
              placeholder="Enter your password"
              className="py-1 px-2 rounded w-full border border-neutral-700 bg-transparent"
            />
          </div>
          <div>{errorMessage && <p className="text-red-500">{errorMessage}</p>}</div>
          <button type="submit" className="bg-white text-black rounded mt-4 py-1 w-32">Sign up</button>
        </form>
        <Link href="/signin" className="text-center text-blue-600">I have an account</Link>
      </div>
    </main>
  )
}