"use client"

import Link from "next/link"
import SignUpForm from "@/components/forms/SignUpForm"
import { useNotification } from "@/components/providers/NotificationProvider"
import { getSession } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function SignUpPage() {
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
        <SignUpForm
          onSuccess={(successMessage) => {
            notify(successMessage, "success")
            router.push("/signin")
          }}
          onFailure={(error) => notify(error, "error")}
        />
        <Link href="/signin" className="text-center text-blue-600">I have an account</Link>
      </main>
    </div>
  )
}