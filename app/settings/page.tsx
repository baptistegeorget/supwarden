"use client"

import Header from "@/components/Header"
import { getSession } from "@/lib/auth"
import { SessionResponse } from "@/types"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function SettingsPage() {
  const router = useRouter()
  const [session, setSession] = useState<SessionResponse | null>(null)

  useEffect(() => {
    getSession()
      .then((session) => {
        if (session) {
          setSession(session)
        } else {
          router.push("/signin")
        }
      })
  }, [router])

  if (!session) return null

  return (
    <>
      <Header session={session} />
    </>
  )
}