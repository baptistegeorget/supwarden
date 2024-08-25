import { getSession } from "@/lib/auth"
import { checkIfMemberExist, getFolderById, getMembersByFolderId, getUserById } from "@/lib/db"
import { UserModel, UserResponse } from "@/types"
import { WithId } from "mongodb"

export async function GET(request: Request, { params }: { params: { userId: string, folderId: string } }) {
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

    // Get the folder
    const folder = await getFolderById(params.folderId)

    if (!folder) {
      return new Response(
        JSON.stringify({
          error: "Folder not found"
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
    }

    // Check if the user is a member of the folder
    const isMember = await checkIfMemberExist(user._id.toHexString(), folder._id.toHexString())

    if (!isMember) {
      return new Response(
        JSON.stringify({
          error: "Folder not found"
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
    }

    // Get the members of the folder
    const members = await getMembersByFolderId(folder._id.toHexString())

    // Return the response
    const usersResponse: UserResponse[] = await Promise.all(members.map(async (member) => {
      const user = await getUserById(member.user.toHexString()) as WithId<UserModel>

      return {
        id: user._id.toHexString(),
        name: user.name,
        email: user.email,
        createdOn: user.createdOn,
        modifiedOn: user.modifiedOn
      }
    }))

    return new Response(
      JSON.stringify({
        members: usersResponse
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      }
    )
  } catch (error) {
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