"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { verify } from "@/lib/jwt"
import { SessionResponse } from "@/types"

if (!process.env.SRV_BASE_URL) {
  throw new Error('Invalid/Missing environment variable: "SRV_BASE_URL"')
}

const srvBaseUrl = process.env.SRV_BASE_URL

export async function signIn(formData: FormData) {
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }

  const response = await fetch(`${srvBaseUrl}/api/auth`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data)
  })

  if (response.ok) {
    const { token }: { token: string } = await response.json()
    cookies().set("auth-token", token)
    redirect("/")
  } else {
    const { error } = await response.json()
    throw new Error(error)
  }
}

export async function signOut() {
  cookies().delete("auth-token")
  redirect("/signin")
}

export async function auth() {
  try {
    const authToken = cookies().get("auth-token")?.value

    if (!authToken) {
      return null
    }

    const session = verify<SessionResponse>(authToken)

    return session
  } catch (error) {
    return null
  }
}