import { getFolderById, getInvitationById, getUserById, updateFolder, updateInvitation } from "@/lib/db"
import { verify } from "@/lib/jwt"
import { Session } from "@/types"
import { cookies } from "next/headers"
import { NextRequest } from "next/server"
import { ZodError } from "zod"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
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

    const isAccepted = request.nextUrl.searchParams.get("isAccepted")

    if (!isAccepted) {
      return Response.json({ error: "Missing isAccepted" }, { status: 400 })
    }

    if (isAccepted !== "true" && isAccepted !== "false") {
      return Response.json({ error: "Invalid isAccepted" }, { status: 400 })
    }

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

    invitation.status = isAccepted === "true" ? "accepted" : "rejected"

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