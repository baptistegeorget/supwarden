import { createFolder, createMember, getFoldersByUserId, getUserById } from "@/lib/db"
import { verify } from "@/lib/jwt"
import { folderSchema } from "@/lib/zod"
import { FolderModel, FolderResponse, MemberModel, SessionResponse, UserModel } from "@/types"
import { WithId } from "mongodb"
import { cookies } from "next/headers"
import { ZodError } from "zod"

export async function POST(request: Request) {
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

    const body = await request.json()

    const { name } = await folderSchema.parseAsync(body)

    const folderModel: FolderModel = {
      name: name,
      type: "shared",
      creatorId: user._id,
      createdOn: new Date().toISOString(),
      modifierId: user._id,
      modifiedOn: new Date().toISOString(),
    }

    const folderResult = await createFolder(folderModel)

    const memberModel: MemberModel = {
      folderId: folderResult.insertedId,
      userId: user._id,
      creatorId: user._id,
      createdOn: new Date().toISOString(),
      modifierId: user._id,
      modifiedOn: new Date().toISOString(),
    }

    await createMember(memberModel)

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

    const folders = await getFoldersByUserId(user._id.toString())

    const foldersResponse: FolderResponse[] = await Promise.all(folders.map(async (folder) => {
      const creator = await getUserById(folder.creatorId.toString()) as WithId<UserModel>

      const modifier = await getUserById(folder.modifierId.toString()) as WithId<UserModel>

      const folderResponse: FolderResponse = {
        id: folder._id.toString(),
        name: folder.name,
        type: folder.type,
        creator: {
          id: creator._id.toString(),
          lastName: creator.lastName,
          firstName: creator.firstName,
          email: creator.email,
          createdOn: creator.createdOn,
          modifiedOn: creator.modifiedOn
        },
        createdOn: folder.createdOn,
        modifier: {
          id: modifier._id.toString(),
          lastName: modifier.lastName,
          firstName: modifier.firstName,
          email: modifier.email,
          createdOn: modifier.createdOn,
          modifiedOn: modifier.modifiedOn
        },
        modifiedOn: folder.modifiedOn
      }

      return folderResponse
    }))

    return Response.json({ folders: foldersResponse }, { status: 200 })
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 400 })
    }
    return Response.json({ error: "An error occurred" }, { status: 500 })
  }
}