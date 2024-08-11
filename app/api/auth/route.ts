import { createSession, getUserByCredentials } from "@/lib/db"
import { hashPassword } from "@/lib/password"
import { signInSchema } from "@/lib/zod"
import { ZodError } from "zod"
import { SessionModel, SessionResponse } from "@/types"
import { sign } from "@/lib/jwt"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { email, password } = await signInSchema.parseAsync(body)

    const user = await getUserByCredentials(email, hashPassword(password))

    if (!user) {
      return Response.json({ error: "Invalid credentials" }, { status: 400 })
    }

    const sessionModel: SessionModel = {
      userId: user._id,
      date: new Date().toISOString()
    }

    const sessionResult = await createSession(sessionModel)

    const sessionResponse: SessionResponse = {
      id: sessionResult.insertedId.toString(),
      user: {
        id: sessionModel.userId.toString(),
        lastName: user.lastName,
        firstName: user.firstName,
        email: user.email,
        createdOn: user.createdOn,
        modifiedOn: user.modifiedOn
      },
      date: sessionModel.date
    }

    const token = sign(sessionResponse)

    return Response.json({ token }, { status: 200 })
  } catch (error) {
    if (error instanceof ZodError) {
      const errorDetails = error.errors.map(e => e.message).join(", ")
      return Response.json({ error: errorDetails }, { status: 400 })
    }
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 400 })
    }
    return Response.json({ error: "An error occurred" }, { status: 500 })
  }
}