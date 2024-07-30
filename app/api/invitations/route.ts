import { createInvitation, getFolderById, getInvitationsByUserId, getUserByEmail, getUserById, getInvitationById, updateInvitation, updateFolder } from "@/lib/db"
import { verify } from "@/lib/jwt"
import { invitationResponseSchema, invitationSchema } from "@/lib/zod"
import { Invitation, Session } from "@/types"
import { ZodError } from "zod"

export async function POST(request: Request) {
  try {
    const authToken = request.headers.get("Authorization")

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

    const invitedUser = await getUserByEmail(email)

    if (!invitedUser) {
      return Response.json({ error: "User not found" }, { status: 404 })
    }

    if (invitedUser._id.toString() === user._id.toString()) {
      return Response.json({ error: "You can't invite yourself" }, { status: 400 })
    }

    const folder = await getFolderById(folderId)

    if (!folder) {
      return Response.json({ error: "Folder not found" }, { status: 404 })
    }

    if (folder.type === "personal") {
      return Response.json({ error: "You can't invite users to personal folders" }, { status: 400 })
    }

    const invitation: Invitation = {
      folder: folder._id,
      user: invitedUser._id,
      status: "pending",
      createdBy: user._id,
      createdOn: new Date().toISOString(),
      modifiedBy: user._id,
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
  }
}

export async function GET(request: Request) {
  try {
    const authToken = request.headers.get("Authorization")

    if (!authToken) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const session = verify<Session>(authToken)

    const user = await getUserById(session.user.id)

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    let invitations = await getInvitationsByUserId(user._id.toString())

    invitations = await Promise.all(invitations.map(async (invitation) => {
      const sender = await getUserById(invitation.createdBy.toString())
      const folder = await getFolderById(invitation.folder.toString())
      const populatedInvitation = {
        ...invitation,
        senderName: sender?.firstName && sender?.lastName ? `${sender?.firstName} ${sender?.lastName}` : undefined,
        folderName: folder?.name
      }
      return populatedInvitation
    }))

    return Response.json({ invitations }, { status: 200 })
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 400 })
    }
  }
}

export async function PATCH(request: Request) {
  try {
    const authToken = request.headers.get("Authorization")

    if (!authToken) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const session = verify<Session>(authToken)

    const user = await getUserById(session.user.id)

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    const { invitationId, isAccepted } = await invitationResponseSchema.parseAsync(body)

    let invitation = await getInvitationById(invitationId)

    if (!invitation) {
      return Response.json({ error: "Invitation not found" }, { status: 404 })
    }

    if (invitation.status !== "pending") {
      return Response.json({ error: "Invitation already responded" }, { status: 400 })
    }

    if (isAccepted) {
      const folder = await getFolderById(invitation.folder.toString())

      if (!folder) {
        return Response.json({ error: "Folder not found" }, { status: 404 })
      }

      folder.members?.push(invitation.user)

      await updateFolder(folder)

      invitation.status = "accepted"
    } else {
      invitation.status = "rejected"
    }

    invitation.modifiedBy = user._id
    invitation.modifiedOn = new Date().toISOString()

    await updateInvitation(invitation)

    return Response.json(null, { status: 200 })
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