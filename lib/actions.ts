"use server"

import { cookies } from "next/headers"

export async function setAuthTokenCookie(authToken: string) {
  cookies().set("auth-token", authToken)
}