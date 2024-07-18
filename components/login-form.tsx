"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginForm() {
  const router = useRouter()

  const [error, setError] = useState<string | null>(null)

  async function handleAction(formData: FormData) {
    setError(null)

    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    }

    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      })
    })

    if (response.ok) {
      router.push("/")
    } else {
      const result = await response.json()
      return setError(result.error)
    }
  }

  return (
    <form
      className="flex flex-col gap-2 w-full items-center"
      action={handleAction}
    >
      <div className="w-full flex flex-col gap-1">
        <p>Email</p>
        <input
          type="email"
          name="email"
          minLength={1}
          required={true}
          placeholder="Enter your email"
          className="py-1 px-2 rounded w-full border border-neutral-700 bg-transparent"
        />
      </div>
      <div className="w-full flex flex-col gap-1">
        <p>Password</p>
        <input
          type="password"
          name="password"
          minLength={8}
          maxLength={32}
          required={true}
          placeholder="Enter your password"
          className="py-1 px-2 rounded w-full border border-neutral-700 bg-transparent"
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit" className="bg-white text-black rounded mt-4 py-1 w-32">Sign in</button>
    </form>
  )
}