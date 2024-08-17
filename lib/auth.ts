"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { SessionResponse } from "@/types"
import jwt from "jsonwebtoken"

if (!process.env.JWT_SECRET) {
  throw new Error("Invalid/Missing environment variable: JWT_SECRET")
}

const JWT_SECRET = process.env.JWT_SECRET

export async function getSession() {
  try {
    const authToken = cookies().get("auth-token")?.value

    if (!authToken) return null

    const session = jwt.verify(authToken, JWT_SECRET) as SessionResponse

    return session
  } catch (error) {
    return null
  }
}

export async function signOut() {
  cookies().delete("auth-token")
  redirect("/signin")
}