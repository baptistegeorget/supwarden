"use client"

import Link from "next/link"
import SignInForm from "@/components/forms/SignInForm"
import { auth } from "@/lib/auth"
import { useContext, useEffect, useState } from "react"
import { NotificationContext } from "@/components/providers/NotificationProvider"
import { useRouter } from "next/navigation"

export default function SignInPage() {
  const notify = useContext(NotificationContext)
  const router = useRouter()

  useEffect(() => {
    async function getSession() {
      const session = await auth()
      if (session) {
        return router.push("/signin")
      }
    }
    getSession()
  }, [router])

  return (
    <div className="flex-1 flex flex-col justify-center items-center">
      <main className="rounded-md shadow-lg py-8 px-16 flex flex-col gap-4 border border-neutral-700">
        <h1 className="text-center text-2xl font-bold">SUPWARDEN</h1>
        <SignInForm
          onSuccess={() => notify("Signed in successfully.", "success")}
          onFailure={(error) => notify(error, "error")}
        />
        <Link href="/signup" className="text-center text-blue-600">I don&apos;t have an account</Link>
      </main>
    </div>
  )
}