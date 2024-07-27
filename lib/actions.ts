"use server"

import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { User } from "@/types"
import { redirect } from "next/navigation"

if (!process.env.JWT_SECRET) {
  throw new Error('Invalid/Missing environment variable: "JWT_SECRET"')
}

const jwtSecret = process.env.JWT_SECRET

export async function setAuthTokenCookie(authToken: string) {
  cookies().set("auth-token", authToken)
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

    const authUser = jwt.verify(authToken, jwtSecret) as User

    return authUser
  } catch (error) {
    return null
  }
}