import { getSession } from "@/lib/auth"
import { checkIfMemberExist, checkIfPendingInvitationExist, createInvitation, getFolderById, getUserByEmail, getUserById } from "@/lib/db"
import { invitationSchema } from "@/lib/zod"
import { InvitationModel } from "@/types"
import { ZodError } from "zod"

export async function POST(request: Request, { params }: { params: { userId: string, folderId: string } }) {
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

    // Get the folder
    const folder = await getFolderById(params.folderId)

    if (!folder) {
      return new Response(
        JSON.stringify({
          error: "Folder not found"
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
    }

    // Check if the user is a member of the folder
    const isMember = await checkIfMemberExist(user._id.toHexString(), folder._id.toHexString())

    if (!isMember) {
      return new Response(
        JSON.stringify({
          error: "Folder not found"
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
    }

    // Check if the folder is personal
    if (folder.type === "personal") {
      return new Response(
        JSON.stringify({
          error: "You can't invite users to a personal folder"
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
    }

    // Get and parse the body
    const body = await request.json()
    const data = await invitationSchema.parseAsync(body)

    // Get the user to invite
    const userToInvite = await getUserByEmail(data.email)

    if (!userToInvite) {
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

    // Check if the user to invite is already a member of the folder
    const userToInviteIsMember = await checkIfMemberExist(userToInvite._id.toHexString(), folder._id.toHexString())

    if (userToInviteIsMember) {
      return new Response(
        JSON.stringify({
          error: "User is already a member of the folder"
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
    }

    // Check if the user to invite has already been invited
    const invitationExist = await checkIfPendingInvitationExist(userToInvite._id.toString(), folder._id.toString())

    if (invitationExist) {
      return new Response(
        JSON.stringify({
          error: "User has already been invited"
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
    }

    // Create the invitation
    const invitationModel: InvitationModel = {
      folder: folder._id,
      user: userToInvite._id,
      status: "pending",
      createdBy: user._id,
      createdOn: new Date().toISOString(),
      modifiedBy: user._id,
      modifiedOn: new Date().toISOString()
    }

    await createInvitation(invitationModel)

    // Return the response
    return new Response(
      JSON.stringify({
        message: "Invitation sent"
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