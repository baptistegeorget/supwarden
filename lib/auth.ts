"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { SessionResponse } from "@/types"
import jwt from "jsonwebtoken"

if (!process.env.SRV_BASE_URL) {
  throw new Error('Invalid/Missing environment variable: "SRV_BASE_URL"')
}

const srvBaseUrl = process.env.SRV_BASE_URL

if (!process.env.JWT_SECRET) {
  throw new Error("Invalid/Missing environment variable: JWT_SECRET")
}

const JWT_SECRET = process.env.JWT_SECRET

export async function getSession() {
  try {
    const authToken = cookies().get("auth-token")?.value

    if (!authToken) {
      return null
    }

    const session = jwt.verify(authToken, JWT_SECRET) as SessionResponse

    return session
  } catch (error) {
    return null
  }
}

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