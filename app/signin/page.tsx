"use client"

import Link from "next/link"
import SignInForm from "@/components/SignInForm"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useNotification } from "@/components/NotificationProvider"
import { getSession } from "@/lib/auth"

export default function SignInPage() {
  const notify = useNotification()
  const router = useRouter()

  useEffect(() => {
    getSession()
      .then((session) => {
        if (session) {
          router.push("/")
        }
      })
  }, [router])

  return (
    <div className="flex-1 flex flex-col justify-center items-center">
      <main className="rounded-md shadow-lg py-8 px-16 flex flex-col gap-4 border border-neutral-700">
        <h1 className="text-center text-2xl font-bold">SUPWARDEN</h1>
        <SignInForm
          onSuccess={(successMessage) => {
            notify(successMessage, "success")
            router.push("/")
          }}
          onFailure={(errorMessage) => notify(errorMessage, "error")}
        />
        <Link href="/signup" className="text-center text-blue-600">I don&apos;t have an account</Link>
      </main>
    </div>
  )
}