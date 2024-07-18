import { NextRequest, NextResponse } from "next/server"
import { signUpSchema } from "@/lib/zod"
import { getUserByEmail, saveUser } from "@/utils/db"
import { hashPassword } from "@/utils/password"
import { ZodError } from "zod"

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json()
    
    const { firstName, lastName, email, password } = await signUpSchema.parseAsync(requestBody)
    
    const user = await getUserByEmail(email)

    if (user) {
      return NextResponse.json({ error: "User already exist" }, { status: 400 })
    }

    const pwHash = hashPassword(password)

    await saveUser(firstName, lastName, email, pwHash)

    return NextResponse.json({ message: "User created" }, { status: 201 })
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