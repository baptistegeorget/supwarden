import { getFolderById, getMembersByFolderId, getUserById } from "@/lib/db"
import { verify } from "@/lib/jwt"
import { MemberResponse, SessionResponse, UserModel } from "@/types"
import { WithId } from "mongodb"
import { cookies } from "next/headers"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
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
      return Response.json({ error: "Missing folderId" }, { status: 400 })
    }

    const folder = await getFolderById(folderId)

    if (!folder) {
      return Response.json({ error: "Folder not found" }, { status: 404 })
    }

    const members = await getMembersByFolderId(folderId)

    if (!members.some((member) => member.userId.toString() === user._id.toString())) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const membersResponse: MemberResponse[] = await Promise.all(members.map(async (member) => {
      const user = await getUserById(member.userId.toString()) as WithId<UserModel>

      const creator = await getUserById(member.creatorId.toString()) as WithId<UserModel>

      const modifier = await getUserById(member.modifierId.toString()) as WithId<UserModel>

      const memberResponse: MemberResponse = {
        id: member._id.toString(),
        user: {
          id: user._id.toString(),
          lastName: user.lastName,
          firstName: user.firstName,
          email: user.email,
          createdOn: user.createdOn,
          modifiedOn: user.modifiedOn
        },
        creator: {
          id: creator._id.toString(),
          lastName: creator.lastName,
          firstName: creator.firstName,
          email: creator.email,
          createdOn: creator.createdOn,
          modifiedOn: creator.modifiedOn
        },
        createdOn: member.createdOn,
        modifier: {
          id: modifier._id.toString(),
          lastName: modifier.lastName,
          firstName: modifier.firstName,
          email: modifier.email,
          createdOn: modifier.createdOn,
          modifiedOn: modifier.modifiedOn
        },
        modifiedOn: member.modifiedOn
      }

      return memberResponse
    }))

    return Response.json({ members: membersResponse }, { status: 200 })
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 400 })
    }
    return Response.json({ error: "An error occurred" }, { status: 500 })
  }
}