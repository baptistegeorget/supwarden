import { createInvitation, getFolderById, getUserByEmail, getUserById } from "@/lib/db"
import { verify } from "@/lib/jwt"
import { invitationSchema } from "@/lib/zod"
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

    const invitation: Invitation = {
      folder: folder._id,
      user: invitedUser._id,
      state: "pending",
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