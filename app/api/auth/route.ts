import { createSession, getUserByCredentials } from "@/lib/db"
import { signInSchema } from "@/lib/zod"
import { ZodError } from "zod"
import { SessionModel, SessionResponse } from "@/types"
import jwt from "jsonwebtoken"
import { createHash } from "crypto"
import { cookies } from "next/headers"

if (!process.env.JWT_SECRET) {
  throw new Error("Invalid/Missing environment variable: JWT_SECRET")
}

const JWT_SECRET = process.env.JWT_SECRET

export async function POST(request: Request) {
  try {
    // Get and parse the body
    const body = await request.json()
    const data = await signInSchema.parseAsync(body)

    // Get the user
    const user = await getUserByCredentials(data.email, createHash("sha256").update(data.password).digest("hex"))

    if (!user) {
      return new Response(
        JSON.stringify({
          error: "The email or password is incorrect"
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
    }

    // Create the session
    const sessionModel: SessionModel = {
      user: user._id,
      createdOn: new Date().toISOString()
    }

    const session = await createSession(sessionModel)

    // Save the session in a cookie
    const sessionResponse: SessionResponse = {
      id: session.insertedId.toHexString(),
      user: {
        id: user._id.toHexString(),
        name: user.name,
        email: user.email
      },
      createdOn: sessionModel.createdOn
    }

    const token = jwt.sign(sessionResponse, JWT_SECRET, { expiresIn: "1h" })

    cookies().set("auth-token", token)

    // Return the response
    return new Response(
      JSON.stringify({
        message: "Successfully signed in"
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