import { createFolder, getFoldersByUserId, getUserById } from "@/lib/db"
import { verify } from "@/lib/jwt"
import { folderSchema } from "@/lib/zod"
import { FolderModel, Folder, Session, UserModel, User } from "@/types"
import { ObjectId } from "mongodb"
import { cookies } from "next/headers"
import { ZodError } from "zod"

export async function POST(request: Request) {
  try {
    const authToken = cookies().get("auth-token")?.value

    if (!authToken) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const session = verify<Session>(authToken)

    const user = await getUserById(new ObjectId(session.user.id))

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    const { name } = await folderSchema.parseAsync(body)

    const folder: FolderModel = {
      name: name,
      type: "shared",
      memberIds: [user._id.toString()],
      creatorId: user._id,
      createdOn: new Date().toISOString(),
      modifierId: user._id,
      modifiedOn: new Date().toISOString(),
    }

    await createFolder(folder)

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

    const user = await getUserById(new ObjectId(session.user.id))

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const folders = await getFoldersByUserId(user._id)

    const foldersResponse: Folder[] = []

    for (const folder of folders) {
      const members: User[] = []

      for (const memberId of folder.memberIds) {
        const member = await getUserById(new ObjectId(memberId))

        if (member) {
          const memberResponse: User = {
            id: member._id.toString(),
            lastName: member.lastName,
            firstName: member.firstName,
            email: member.email,
            createdOn: member.createdOn,
            modifiedOn: member.modifiedOn
          }
          members.push(memberResponse)
        }
      }

      const creator = await getUserById(folder.creatorId)

      const modifier = await getUserById(folder.modifierId)

      if (creator && modifier) {
        const folderResponse: Folder = {
          id: folder._id.toString(),
          name: folder.name,
          type: folder.type,
          members: members,
          creator: {
            id: creator?._id.toString(),
            lastName: creator?.lastName,
            firstName: creator?.firstName,
            email: creator?.email,
            createdOn: creator?.createdOn,
            modifiedOn: creator?.modifiedOn
          },
          createdOn: folder.createdOn,
          modifier: {
            id: modifier?._id.toString(),
            lastName: modifier?.lastName,
            firstName: modifier?.firstName,
            email: modifier?.email,
            createdOn: modifier?.createdOn,
            modifiedOn: modifier?.modifiedOn
          },
          modifiedOn: folder.modifiedOn
        }
        foldersResponse.push(folderResponse)
      }
    }

    return Response.json({ folders: foldersResponse }, { status: 200 })
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 400 })
    }
    return Response.json({ error: "An error occurred" }, { status: 500 })
  }
}