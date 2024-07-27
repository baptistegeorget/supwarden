"use server"

import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { Folder, User } from "@/types"
import { redirect } from "next/navigation"
import { WithId } from "mongodb"

if (!process.env.JWT_SECRET) {
  throw new Error('Invalid/Missing environment variable: "JWT_SECRET"')
}

if (!process.env.BASE_URL) {
  throw new Error('Invalid/Missing environment variable: "BASE_URL"')
}

const jwtSecret = process.env.JWT_SECRET
const baseUrl = process.env.BASE_URL

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

    const authUser = await decodeAuthToken(authToken)

    return authUser
  } catch (error) {
    return null
  }
}

export async function decodeAuthToken(authToken: string) {
  try {
    const authUser = jwt.verify(authToken, jwtSecret) as WithId<User>
    return authUser
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error("Token expired")
    }
    throw new Error("Invalid token")
  }
}

export async function createSharedFolder(name: string) {
  const authToken = cookies().get("auth-token")?.value

  if (!authToken) {
    redirect("/signin")
  }

  const response = await fetch(`${baseUrl}/api/folders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authToken,
    },
    body: JSON.stringify({ name }),
  })

  if (response.ok) {
    return null
  } else {
    const result = await response.json()
    return result.error
  }
}

export async function getFolders() {
  const authToken = cookies().get("auth-token")?.value

  if (!authToken) {
    return []
  }

  const response = await fetch(`${baseUrl}/api/folders`, {
    headers: {
      Authorization: authToken,
    },
  })

  if (response.ok) {
    const folders: WithId<Folder>[] = await response.json()
    return folders
  } else {
    return []
  }
}