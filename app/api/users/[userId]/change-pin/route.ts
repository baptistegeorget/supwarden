import { getSession } from "@/lib/auth"
import { createSession, getUserById, updateUser } from "@/lib/db"
import { changePinSchema } from "@/lib/zod"
import { SessionModel, SessionResponse } from "@/types"
import { createHash } from "crypto"
import { ZodError } from "zod"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

if (!process.env.JWT_SECRET) {
  throw new Error("Invalid/Missing environment variable: JWT_SECRET")
}

const JWT_SECRET = process.env.JWT_SECRET

export async function PATCH(request: Request, { params }: { params: { userId: string } }) {
  try {
    // Get the session
    const session = await getSession()

    if (!session) {
      return new Response(
        JSON.stringify({
          error: "Unauthorized"
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
    }

    // Get the user
    const user = await getUserById(params.userId)

    if (!user) {
      return new Response(
        JSON.stringify({
          error: "User not found"
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
    }

    // Check if the user is the same as the session user
    if (session.user.id !== user._id.toHexString()) {
      return new Response(
        JSON.stringify({
          error: "Unauthorized"
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
    }

    // Get and parse the body
    const body = await request.json()
    const data = await changePinSchema.parseAsync(body)

    // Update the user
    user.pin = createHash("sha256").update(data.pin).digest("hex")
    await updateUser(user)

    // Create new session
    const sessionModel: SessionModel = {
      user: user._id,
      createdOn: new Date().toISOString()
    }

    const newSession = await createSession(sessionModel)

    // Save the session in a cookie
    const sessionResponse: SessionResponse = {
      id: newSession.insertedId.toHexString(),
      user: {
        id: user._id.toHexString(),
        name: user.name,
        email: user.email,
        hasPin: !!user.pin
      },
      createdOn: sessionModel.createdOn
    }

    const token = jwt.sign(sessionResponse, JWT_SECRET, { expiresIn: "1h" })

    cookies().set("auth-token", token)

    // Return the response
    return new Response(
      JSON.stringify({
        message: "PIN changed"
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      }
    )
  } catch (error) {
    if (error instanceof ZodError) {
      const errorDetails = error.errors.map(e => e.message).join(", ")
      return new Response(
        JSON.stringify({
          error: errorDetails
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
    }
    if (error instanceof Error) {
      return new Response(
        JSON.stringify({
          error: error.message
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
    }
    return new Response(
      JSON.stringify({
        error: "An unknown error occurred"
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    )
  }
}