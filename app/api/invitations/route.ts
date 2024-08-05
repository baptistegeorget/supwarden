import { createInvitation, getFolderById, getPendingInvitationsByUserId, getUserByEmail, getUserById, checkPendingInvitationExist } from "@/lib/db"
import { verify } from "@/lib/jwt"
import { invitationSchema } from "@/lib/zod"
import { Invitation, InvitationModel, Session } from "@/types"
import { cookies } from "next/headers"
import { ZodError } from "zod"

export async function POST(request: Request) {
  try {
    const authToken = cookies().get("auth-token")?.value

    if (!authToken) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const session = verify<Session>(authToken)

    const user = await getUserById(session.user.id)

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    const { email, folderId } = await invitationSchema.parseAsync(body)

    const userToInvite = await getUserByEmail(email)

    if (!userToInvite) {
      return Response.json({ error: "User not found" }, { status: 404 })
    }

    if (userToInvite._id.toString() === user._id.toString()) {
      return Response.json({ error: "You can't invite yourself" }, { status: 400 })
    }

    const folder = await getFolderById(folderId)

    if (!folder) {
      return Response.json({ error: "Folder not found" }, { status: 404 })
    }

    if (folder.type === "personal") {
      return Response.json({ error: "You can't invite users to your personal folder" }, { status: 400 })
    }

    if (folder.memberIds.includes(userToInvite._id.toString())) {
      return Response.json({ error: "User is already a member of this folder" }, { status: 400 })
    }

    const invitationExist = await checkPendingInvitationExist(userToInvite._id.toString(), folder._id.toString())

    if (invitationExist) {
      return Response.json({ error: "Invitation already sent" }, { status: 400 })
    }

    const invitation: InvitationModel = {
      folderId: folder._id,
      userId: userToInvite._id,
      status: "pending",
      creatorId: user._id,
      createdOn: new Date().toISOString(),
      modifierId: user._id,
      modifiedOn: new Date().toISOString(),
    }

    await createInvitation(invitation)

    return Response.json(null, { status: 201 })
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

export async function GET() {
  try {
    const authToken = cookies().get("auth-token")?.value

    if (!authToken) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const session = verify<Session>(authToken)

    const user = await getUserById(session.user.id)

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const invitations = await getPendingInvitationsByUserId(user._id.toString())

    const invitationsResponse: Invitation[] = await Promise.all(invitations.map(async (invitation) => {
      const folder = await getFolderById(invitation.folderId.toString())

      const user = await getUserById(invitation.userId.toString())

      const creator = await getUserById(invitation.creatorId.toString())

      const modifier = await getUserById(invitation.modifierId.toString())
      
      const invitationResponse: Invitation = {
        id: invitation._id.toString(),
        folder: folder ? {
          id: folder._id.toString(),
          name: folder.name,
        } : null,
        user: user ? {
          id: user._id.toString(),
          lastName: user.lastName,
          firstName: user.firstName,
          email: user.email,
        } : null,
        status: invitation.status,
        creator: creator ? {
          id: creator._id.toString(),
          lastName: creator.lastName,
          firstName: creator.firstName,
          email: creator.email,
        } : null,
        createdOn: invitation.createdOn,
        modifier: modifier ? {
          id: modifier._id.toString(),
          lastName: modifier.lastName,
          firstName: modifier.firstName,
          email: modifier.email,
        } : null,
        modifiedOn: invitation.modifiedOn
      }
      
      return invitationResponse
    }))

    return Response.json({ invitations: invitationsResponse }, { status: 200 })
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 400 })
    }
  }
}