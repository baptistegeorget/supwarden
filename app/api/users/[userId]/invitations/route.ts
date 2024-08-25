import { getSession } from "@/lib/auth"
import { getFolderById, getPendingInvitationsByUserId, getUserById } from "@/lib/db"
import { FolderModel, InvitationResponse, UserModel } from "@/types"
import { WithId } from "mongodb"

export async function GET(_request: Request, { params }: { params: { userId: string } }) {
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

    // Get the pending invitations
    const invitations = await getPendingInvitationsByUserId(user._id.toString())

    // Return the response
    const invitationsResponse: InvitationResponse[] = await Promise.all(invitations.map(async (invitation) => {
      const folder = await getFolderById(invitation.folder.toHexString()) as WithId<FolderModel>
      const createdBy = await getUserById(invitation.createdBy.toHexString()) as WithId<UserModel>
      const modifiedBy = await getUserById(invitation.modifiedBy.toHexString()) as WithId<UserModel>

      return {
        id: invitation._id.toHexString(),
        folder: {
          id: folder._id.toHexString(),
          name: folder.name
        },
        user: {
          id: invitation.user.toHexString(),
          name: user.name,
          email: user.email
        },
        status: invitation.status,
        createdBy: {
          id: invitation.createdBy.toHexString(),
          name: createdBy.name,
          email: createdBy.email
        },
        createdOn: invitation.createdOn,
        modifiedBy: {
          id: invitation.modifiedBy.toHexString(),
          name: modifiedBy.name,
          email: modifiedBy.email
        },
        modifiedOn: invitation.modifiedOn
      }
    }))

    return new Response(
      JSON.stringify({
        invitations: invitationsResponse
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