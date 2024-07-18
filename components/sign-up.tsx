"use client"

import { useRef, useState } from "react"

export function CredentialsSignUp() {
  const formRef = useRef<HTMLFormElement>(null)

  const [error, setError] = useState<string | null>(null)

  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setError(null)

    setSuccessMessage(null)

    const form = formRef.current

    if (form) {
      const formData = new FormData(form)

      const data = {
        firstName: formData.get('firstName') as string,
        lastName: formData.get('lastName') as string,
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        passwordConfirmation: formData.get('passwordConfirmation') as string,
      }

      if (data.password !== data.passwordConfirmation) {
        return setError("Passwords don't match")
      }

      try {
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: data.password,
          })
        })

        if (response.ok) {
          form.reset()
          return setSuccessMessage("Successful registration")
        } else {
          const result = await response.json()
          return setError(result.error)
        }
      } catch (error) {
        return setError("An error occurred while submitting the form")
      }
    }
  }

  return (
    <form
      ref={formRef}
      className="flex flex-col gap-2 w-full items-center"
      onSubmit={handleSubmit}
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
          placeholder="Enter your password"
          className="py-1 px-2 rounded w-full border border-neutral-700 bg-transparent"
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}
      <button type="submit" className="bg-white text-black rounded mt-4 py-1 w-32">Sign up</button>
    </form>
  )
}