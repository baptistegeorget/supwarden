"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { verify } from "@/lib/jwt"
import { Session } from "@/types"

export async function setAuthToken(token: string) {
  cookies().set("auth-token", token)
}

export async function getAuthToken() {
  return cookies().get("auth-token")?.value
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

    const session = verify<Session>(authToken)

    return session
  } catch (error) {
    return null
  }
}