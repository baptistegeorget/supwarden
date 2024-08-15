import { createInvitation, getFolderById, getPendingInvitationsByUserId, getUserByEmail, getUserById, checkPendingInvitationExist, getMemberByInformations, getInvitationById, createMember, updateInvitation } from "@/lib/db"
import { verify } from "@/lib/jwt"
import { invitationSchema } from "@/lib/zod"
import { InvitationResponse, InvitationModel, SessionResponse, UserModel, FolderModel } from "@/types"
import { WithId } from "mongodb"
import { cookies } from "next/headers"
import { NextRequest } from "next/server"
import { ZodError } from "zod"

export async function POST(request: NextRequest) {
  try {
    const authToken = cookies().get("auth-token")?.value

    if (!authToken) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const session = verify<SessionResponse>(authToken)

    const user = await getUserById(session.user.id)

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const folderId = request.nextUrl.searchParams.get("folderId")

    if (!folderId) {
      return Response.json({ error: "Folder ID is required" }, { status: 400 })
    }

    const folder = await getFolderById(folderId)

    if (!folder) {
      return Response.json({ error: "Folder not found" }, { status: 404 })
    }

    if (folder.creatorId.toString() !== user._id.toString()) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (folder.type === "personal") {
      return Response.json({ error: "You can't invite users to your personal folder" }, { status: 400 })
    }

    const body = await request.json()

    const { email } = await invitationSchema.parseAsync(body)

    const userToInvite = await getUserByEmail(email)

    if (!userToInvite) {
      return Response.json({ error: "User not found" }, { status: 404 })
    }

    const member = await getMemberByInformations(userToInvite._id.toString(), folder._id.toString())

    if (member) {
      return Response.json({ error: "User is already a member of this folder" }, { status: 400 })
    }

    const invitationExist = await checkPendingInvitationExist(userToInvite._id.toString(), folder._id.toString())

    if (invitationExist) {
      return Response.json({ error: "Invitation already sent" }, { status: 400 })
    }

    const invitationModel: InvitationModel = {
      folderId: folder._id,
      userId: userToInvite._id,
      status: "pending",
      creatorId: user._id,
      createdOn: new Date().toISOString(),
      modifierId: user._id,
      modifiedOn: new Date().toISOString(),
    }

    await createInvitation(invitationModel)

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

    const session = verify<SessionResponse>(authToken)

    const user = await getUserById(session.user.id)

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const invitations = await getPendingInvitationsByUserId(user._id.toString())

    const invitationsResponse: InvitationResponse[] = await Promise.all(invitations.map(async (invitation) => {
      const folder = await getFolderById(invitation.folderId.toString()) as WithId<FolderModel>

      const creatorOfFolder = await getUserById(folder.creatorId.toString()) as WithId<UserModel>

      const modifierOfFolder = await getUserById(folder.modifierId.toString()) as WithId<UserModel>

      const user = await getUserById(invitation.userId.toString()) as WithId<UserModel>

      const creator = await getUserById(invitation.creatorId.toString()) as WithId<UserModel>

      const modifier = await getUserById(invitation.modifierId.toString()) as WithId<UserModel>

      const invitationResponse: InvitationResponse = {
        id: invitation._id.toString(),
        folder: {
          id: folder._id.toString(),
          name: folder.name,
          type: folder.type,
          creator: {
            id: creatorOfFolder._id.toString(),
            lastName: creatorOfFolder.lastName,
            firstName: creatorOfFolder.firstName,
            email: creatorOfFolder.email,
            createdOn: creatorOfFolder.createdOn,
            modifiedOn: creatorOfFolder.modifiedOn
          },
          createdOn: folder.createdOn,
          modifier: {
            id: modifierOfFolder._id.toString(),
            lastName: modifierOfFolder.lastName,
            firstName: modifierOfFolder.firstName,
            email: modifierOfFolder.email,
            createdOn: modifierOfFolder.createdOn,
            modifiedOn: modifierOfFolder.modifiedOn
          },
          modifiedOn: folder.modifiedOn
        },
        user: {
          id: user._id.toString(),
          lastName: user.lastName,
          firstName: user.firstName,
          email: user.email,
          createdOn: user.createdOn,
          modifiedOn: user.modifiedOn
        },
        status: invitation.status,
        creator: {
          id: creator._id.toString(),
          lastName: creator.lastName,
          firstName: creator.firstName,
          email: creator.email,
          createdOn: invitation.createdOn,
          modifiedOn: invitation.modifiedOn
        },
        createdOn: invitation.createdOn,
        modifier: {
          id: modifier._id.toString(),
          lastName: modifier.lastName,
          firstName: modifier.firstName,
          email: modifier.email,
          createdOn: invitation.createdOn,
          modifiedOn: invitation.modifiedOn
        },
        modifiedOn: invitation.modifiedOn
      }

      return invitationResponse
    }))

    return Response.json({ invitations: invitationsResponse }, { status: 200 })
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 400 })
    }
    return Response.json({ error: "An error occurred" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const authToken = cookies().get("auth-token")?.value

    if (!authToken) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const session = verify<SessionResponse>(authToken)

    const user = await getUserById(session.user.id)

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const invitationId = request.nextUrl.searchParams.get("invitationId")

    if (!invitationId) {
      return Response.json({ error: "Invitation ID is required" }, { status: 400 })
    }

    const invitation = await getInvitationById(invitationId)

    if (!invitation) {
      return Response.json({ error: "Invitation not found" }, { status: 404 })
    }

    if (invitation.userId.toString() !== user._id.toString()) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (invitation.status !== "pending") {
      return Response.json({ error: "Invitation has already been responded to" }, { status: 400 })
    }

    const status = request.nextUrl.searchParams.get("status")

    if (!status) {
      return Response.json({ error: "Missing status" }, { status: 400 })
    }

    if (status !== "accepted" && status !== "rejected") {
      return Response.json({ error: "Invalid status" }, { status: 400 })
    }

    const folder = await getFolderById(invitation.folderId.toString())

    if (!folder) {
      return Response.json({ error: "Folder not found" }, { status: 404 })
    }

    const member = await getMemberByInformations(user._id.toString(), folder._id.toString())

    if (!member && status === "accepted") {
      await createMember({
        userId: user._id,
        folderId: folder._id,
        creatorId: user._id,
        createdOn: new Date().toISOString(),
        modifierId: user._id,
        modifiedOn: new Date().toISOString()
      })
    }

    invitation.status = status
    invitation.modifierId = user._id
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
    return Response.json({ error: "An error occurred" }, { status: 500 })
  }
}