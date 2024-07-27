import { getUserByCredentials } from "@/lib/db"
import { hashPassword } from "@/lib/password"
import { signInSchema } from "@/lib/zod"
import { ZodError } from "zod"
import jwt from "jsonwebtoken"

if (!process.env.JWT_SECRET) {
  throw new Error('Invalid/Missing environment variable: "JWT_SECRET"')
}

const jwtSecret = process.env.JWT_SECRET

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { email, password } = await signInSchema.parseAsync(body)

    const hashedPassword = hashPassword(password)

    const user = await getUserByCredentials(email, hashedPassword)

    if (!user) {
      return Response.json({ error: "Invalid credentials" }, { status: 400 })
    }

    const token = jwt.sign(user, jwtSecret, { expiresIn: "1h" })

    return Response.json({ token }, { status: 200 })
  } catch (error) {
    if (error instanceof ZodError) {
      return Response.json({ error: error.errors }, { status: 400 })
    }
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 400 })
    }
  }
}