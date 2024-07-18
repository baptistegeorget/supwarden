import { signInSchema } from "@/lib/zod"
import { getUserByEmail } from "@/utils/db"
import { NextRequest, NextResponse } from "next/server"
import { ZodError } from "zod"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import { comparePasswords } from "@/utils/password"

if (!process.env.JWT_SECRET) {
  throw new Error('Invalid/Missing environment variable: "JWT_SECRET"')
}

const jwtSecret = process.env.JWT_SECRET

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json()

    const { email, password } = await signInSchema.parseAsync(requestBody)

    const user = await getUserByEmail(email)

    if (!user) {
      return NextResponse.json({ error: "No accounts found" }, { status: 400 })
    }

    const isPasswordsMatch = await comparePasswords(password, user.password)

    if (!isPasswordsMatch) {
      return NextResponse.json({ error: "Invalid password" }, { status: 400 })
    }

    const token = jwt.sign({ email: user.email }, jwtSecret, { expiresIn: "1h" })

    cookies().set('token', token)

    return NextResponse.json({ message: "User authenticated" }, { status: 200 })
  } catch (error) {
    if (error instanceof ZodError) {
      const formattedErrors = error.errors.map((err) => ({
        path: err.path.join('.'),
        message: err.message
      }))
      return NextResponse.json({ error: formattedErrors }, { status: 400 })
    }
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}