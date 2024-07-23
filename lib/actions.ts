"use server"

import { User } from "@/types"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

if (!process.env.JWT_SECRET) {
  throw new Error('Invalid/Missing environment variable: "JWT_SECRET"')
}

const jwtSecret = process.env.JWT_SECRET

export async function setAuthToken(token: string) {
  cookies().set("auth-token", token)
}

export async function getAuthUser() {
  try {
    const token = cookies().get("auth-token")

    if (!token) {
      return null
    }

    const authUser = jwt.verify(token.value, jwtSecret) as User
    
    return authUser
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return null
    }
    return null
  }
}