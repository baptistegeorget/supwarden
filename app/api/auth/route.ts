import { getUserByCredentials } from "@/lib/db"
import { hashPassword } from "@/lib/password"
import { signInSchema } from "@/lib/zod"
import { ZodError } from "zod"
import { Session } from "@/types"
import { sign } from "@/lib/jwt"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { email, password } = await signInSchema.parseAsync(body)

    const hashedPassword = hashPassword(password)

    const user = await getUserByCredentials(email, hashedPassword)

    if (!user) {
      return Response.json({ error: "Invalid credentials" }, { status: 400 })
    }

    const session: Session = {
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.firstName + " " + user.lastName,
      }
    }

    const token = sign(session)

    return Response.json({ token }, { status: 200 })
  } catch (error) {
    if (error instanceof ZodError) {
      const errorDetails = error.errors.map(e => e.message).join(", ")
      return Response.json({ error: errorDetails }, { status: 400 })
    }
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 400 })
    }
  }
}