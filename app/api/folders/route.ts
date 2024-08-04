import { createFolder, getFoldersByUserId, getUserById } from "@/lib/db"
import { verify } from "@/lib/jwt"
import { folderSchema } from "@/lib/zod"
import { Folder, Session } from "@/types"
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

    const { name } = await folderSchema.parseAsync(body)

    const folder: Folder = {
      name: name,
      type: "shared",
      members: [],
      createdBy: user._id,
      createdOn: new Date().toISOString(),
      modifiedBy: user._id,
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

    const folders = await getFoldersByUserId(user._id.toString())

    return Response.json({ folders }, { status: 200 })
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 400 })
    }
  }
}