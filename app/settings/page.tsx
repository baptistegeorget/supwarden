"use client"

import Header from "@/components/header"
import { useNotification } from "@/components/providers/NotificationProvider"
import { auth } from "@/lib/auth"
import { SessionResponse } from "@/types"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function SettingsPage() {
  const notify = useNotification()
  const router = useRouter()
  const [session, setSession] = useState<SessionResponse | null>(null)

  useEffect(() => {
    getSession(router)
  }, [])

  async function getSession(router: AppRouterInstance) {
    const session = await auth()
    if (session) {
      return setSession(session)
    } else {
      return router.push("/signin")
    }
  }

  if (!session) return null

  return (
    <>
      <Header session={session} />
    </>
  )
}