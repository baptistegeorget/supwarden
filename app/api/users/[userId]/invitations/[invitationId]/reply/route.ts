import { getSession } from "@/lib/auth"
import { createMember, getInvitationById, getUserById, updateInvitation } from "@/lib/db"
import { invitationResponseSchema } from "@/lib/zod"
import { MemberModel } from "@/types"
import { ZodError } from "zod"

export async function POST(request: Request, { params }: { params: { userId: string, invitationId: string } }) {
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

    // Get the invitation
    const invitation = await getInvitationById(params.invitationId)

    if (!invitation) {
      return new Response(
        JSON.stringify({
          error: "Invitation not found"
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
    }

    // Check if the invitation is for the user
    if (invitation.user.toHexString() !== user._id.toHexString()) {
      return new Response(
        JSON.stringify({
          error: "Not found"
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
    }

    // Get and parse the body
    const body = await request.json()
    const data = await invitationResponseSchema.parseAsync(body)

    // Update the invitation
    invitation.status = data.response ? "accepted" : "rejected"
    invitation.modifiedBy = user._id
    invitation.modifiedOn = new Date().toISOString()
    
    await updateInvitation(invitation)

    // Add the user to the folder
    if (invitation.status === "accepted") {
      const member: MemberModel = {
        folder: invitation.folder,
        user: user._id
      }

      await createMember(member)
    }

    // Return the response
    return new Response(
      JSON.stringify({
        message: `Invitation ${invitation.status}`
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