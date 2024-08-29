import { getSession } from "@/lib/auth"
import { getUserById, updateUser } from "@/lib/db"
import { changePasswordSchema } from "@/lib/zod"
import { createHash } from "crypto"
import { ZodError } from "zod"

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
    const data = await changePasswordSchema.parseAsync(body)

    // Check password
    if (user.password !== createHash("sha256").update(data.currentPassword).digest("hex")) {
      return new Response(
        JSON.stringify({
          error: "The current password is incorrect"
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
    }

    // Update the user
    user.password = createHash("sha256").update(data.newPassword).digest("hex")
    await updateUser(user)

    // Return the response
    return new Response(
      JSON.stringify({
        message: "Password changed"
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