import { getSession } from "@/lib/auth"
import { createFolder, createMember, getUserById } from "@/lib/db"
import { folderSchema } from "@/lib/zod"
import { FolderModel, FolderResponse, MemberModel } from "@/types"
import { ZodError } from "zod"

export async function POST(request: Request, { params }: { params: { userId: string } }) {
  try {
    // Get the session
    const session = await getSession()

    if (!session) {
      return new Response(
        JSON.stringify({
          error: "Unauthorized"
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
    }

    // Get the user
    const user = await getUserById(params.userId)

    if (!user) {
      return new Response(
        JSON.stringify({
          error: "User not found"
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
    }

    // Check if the user is the same as the session user
    if (session.user.id !== user._id.toHexString()) {
      return new Response(
        JSON.stringify({
          error: "Unauthorized"
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
    }

    // Get and validate the body
    const body = await request.json()
    const data = await folderSchema.parseAsync(body)

    // Create the folder
    const folderModel: FolderModel = {
      name: data.name,
      type: "shared",
      createdBy: user._id,
      createdOn: new Date().toISOString(),
      modifiedBy: user._id,
      modifiedOn: new Date().toISOString(),
    }

    const folderResult = await createFolder(folderModel)

    // Add the user as a member
    const memberModel: MemberModel = {
      folder: folderResult.insertedId,
      user: user._id
    }

    await createMember(memberModel)

    // Return the response
    const folderResponse: FolderResponse = {
      id: folderResult.insertedId.toHexString(),
      name: folderModel.name,
      type: folderModel.type,
      createdBy: {
        id: user._id.toHexString(),
        name: user.name,
        email: user.email
      },
      createdOn: folderModel.createdOn,
      modifiedBy: {
        id: user._id.toHexString(),
        name: user.name,
        email: user.email
      },
      modifiedOn: folderModel.modifiedOn
    }

    return new Response(
      JSON.stringify({
        message: "Folder created successfully",
        folder: folderResponse
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
          "Location": `/api/users/${user._id.toHexString()}/folders/${folderResult.insertedId.toHexString()}`
        }
      }
    )
  } catch (error) {
    if (error instanceof ZodError) {
      const errorDetails = error.errors.map(e => e.message).join(", ")
      return new Response(
        JSON.stringify({
          error: errorDetails
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
    }
    if (error instanceof Error) {
      return new Response(
        JSON.stringify({
          error: error.message
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
    }
    return new Response(
      JSON.stringify({
        error: "An unknown error occurred"
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    )
  }
}