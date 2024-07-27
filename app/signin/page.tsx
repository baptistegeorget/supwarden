"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { auth, setAuthTokenCookie } from "@/lib/actions"

export default function SignInPage() {
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)

  const router = useRouter()

  useEffect(() => {
    async function checkAuthUser() {
      const user = await auth()

      if (user) {
        router.push("/")
      }
    }
    checkAuthUser()
  }, [router])

  async function handleSignInForm(formData: FormData) {
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
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      })
    })

    if (response.ok) {
      const result = await response.json()
      await setAuthTokenCookie(result.token)
      router.push("/")
    } else {
      const result = await response.json()
      return setErrorMessage(result.error)
    }
  }

  async function handleGithubButton() {

  }

  return (
    <main className="flex-1 flex flex-col justify-center items-center">
      <div className="rounded-md shadow-lg py-8 px-16 flex flex-col gap-4 border border-neutral-700">
        <h1 className="text-center text-2xl">SUPWARDEN</h1>
        <form
          className="flex flex-col gap-2 w-full items-center"
          action={handleSignInForm}
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
          <div>{errorMessage && <p className="text-red-500">{errorMessage}</p>}</div>
          <button type="submit" className="bg-white text-black rounded mt-4 py-1 w-32">Sign in</button>
        </form>
        <p className="text-center">Or</p>
        <form
          action={handleGithubButton}
        >
          <button type="submit" className="flex items-center bg-white text-black px-4 py-2 rounded-md w-full shadow-lg">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                d="M12 0C5.373 0 0 5.373 0 12c0 5.303 3.438 9.8 8.207 11.387.6.111.793-.261.793-.58 0-.287-.011-1.045-.016-2.05-3.338.724-4.042-1.607-4.042-1.607-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.083-.729.083-.729 1.204.085 1.837 1.237 1.837 1.237 1.07 1.833 2.807 1.304 3.492.997.108-.775.419-1.305.762-1.605-2.665-.303-5.467-1.334-5.467-5.93 0-1.31.467-2.382 1.235-3.222-.123-.303-.536-1.524.117-3.176 0 0 1.008-.323 3.3 1.23a11.47 11.47 0 013.003-.403c1.02.005 2.046.138 3.003.403 2.29-1.553 3.296-1.23 3.296-1.23.654 1.653.242 2.874.12 3.176.77.84 1.232 1.912 1.232 3.222 0 4.61-2.807 5.625-5.478 5.922.43.372.823 1.104.823 2.226 0 1.606-.014 2.899-.014 3.293 0 .32.19.696.8.578C20.565 21.796 24 17.298 24 12c0-6.627-5.373-12-12-12z"
                clipRule="evenodd"
              />
            </svg>
            Sign in with Github
          </button>
        </form>
        <Link href="/signup" className="text-center text-blue-600">I don&apos;t have an account</Link>
        <Link href="/forgot-password" className="text-center text-blue-600">I forgot my password</Link>
      </div>
    </main>
  )
}