"use client"

import Link from "next/link"
import SignUpForm from "@/components/forms/SignUpForm"
import { useContext, useEffect } from "react"
import { NotificationContext } from "@/components/providers/NotificationProvider"
import { auth } from "@/lib/auth"
import { useRouter } from "next/navigation"

export default function SignUpPage() {
  const notify = useContext(NotificationContext)
  const router = useRouter()

  useEffect(() => {
    async function getSession() {
      const session = await auth()
      if (session) {
        return router.push("/")
      }
    }
    getSession()
  }, [router])

  return (
    <div className="flex-1 flex flex-col justify-center items-center">
      <main className="rounded-md shadow-lg py-8 px-16 flex flex-col gap-4 border border-neutral-700">
        <h1 className="text-center text-2xl font-bold">SUPWARDEN</h1>
        <SignUpForm 
          onSuccess={() => {
            notify("Account created successfully. Please sign in.", "success")
            router.push("/signin")
          }}
          onFailure={(error) => notify(error, "error")}
        />
        <Link href="/signin" className="text-center text-blue-600">I have an account</Link>
      </main>
    </div>
  )
}