import { getFolderById, getInvitationById, getUserById, updateFolder, updateInvitation } from "@/lib/db"
import { verify } from "@/lib/jwt"
import { invitationResponseSchema } from "@/lib/zod"
import { Session } from "@/types"
import { cookies } from "next/headers"

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
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

    const { isAccepted } = await invitationResponseSchema.parseAsync(body)

    const invitation = await getInvitationById(params.id)

    if (!invitation) {
      return Response.json({ error: "Invitation not found" }, { status: 404 })
    }

    if (invitation.userId.toString() !== user._id.toString()) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (invitation.status !== "pending") {
      return Response.json({ error: "Invitation has already been responded to" }, { status: 400 })
    }

    const folder = await getFolderById(invitation.folderId.toString())

    if (!folder) {
      return Response.json({ error: "Folder not found" }, { status: 404 })
    }

    if (!folder.memberIds.includes(user._id.toString()) && isAccepted) {
      folder.memberIds.push(user._id.toString())
      await updateFolder(folder)
    }

    invitation.status = isAccepted ? "accepted" : "rejected"

    await updateInvitation(invitation)

    return Response.json(null, { status: 200 })
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 400 })
    }
    return Response.json({ error: "An error occurred" }, { status: 500 })
  }
}