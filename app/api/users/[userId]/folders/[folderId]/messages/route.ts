import { getSession } from "@/lib/auth"
import { checkIfMemberExist, createMessage, getFolderById, getMessagesByFolderId, getUserById } from "@/lib/db"
import { messageSchema } from "@/lib/zod"
import { MessageModel, MessageResponse, UserModel } from "@/types"
import { WithId } from "mongodb"
import { ZodError } from "zod"

export async function POST(request: Request, { params }: { params: { userId: string, folderId: string } }) {
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

    // Check if the folder is private
    if (folder.type === "private") {
      return new Response(
        JSON.stringify({
          error: "You can't send a message to a private folder"
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
    }

    // Get and parse the body
    const body = await request.json()
    const data = await messageSchema.parseAsync(body)

    // If is private message
    let recipient

    if (data.recipient) {
      recipient = await getUserById(data.recipient)

      if (!recipient) {
        return new Response(
          JSON.stringify({
            error: "Recipient not found"
          }),
          {
            status: 404,
            headers: {
              "Content-Type": "application/json"
            }
          }
        )
      }
    }

    // Create the message
    const messageModel: MessageModel = {
      folder: folder._id,
      body: data.body,
      recipient: recipient?._id,
      createdBy: user._id,
      createdOn: new Date().toISOString(),
      modifiedBy: user._id,
      modifiedOn: new Date().toISOString()
    }

    const message = await createMessage(messageModel)

    // Return the response
    const messageResponse: MessageResponse = {
      id: message.insertedId.toHexString(),
      folder: {
        id: folder._id.toHexString(),
        name: folder.name
      },
      body: messageModel.body,
      recipient: recipient && {
        id: recipient._id.toHexString(),
        name: recipient.name,
        email: recipient.email
      },
      createdBy: {
        id: user._id.toHexString(),
        name: user.name,
        email: user.email
      },
      createdOn: messageModel.createdOn,
      modifiedBy: {
        id: user._id.toHexString(),
        name: user.name,
        email: user.email
      },
      modifiedOn: messageModel.modifiedOn
    }

    return new Response(
      JSON.stringify(messageResponse),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
          "Location": `/api/users/${params.userId}/folders/${params.folderId}/messages/${messageResponse.id}`
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

    // Check if the folder is private
    if (folder.type === "private") {
      return new Response(
        JSON.stringify({
          error: "You cannot view messages in a private folder"
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
    }

    // Get the messages
    const messages = await getMessagesByFolderId(folder._id.toHexString())

    // Return the response
    const messagesResponse: MessageResponse[] = await Promise.all(messages.map(async (message) => {
      const recipient = message.recipient && await getUserById(message.recipient.toHexString()) as WithId<UserModel>
      const createdBy = await getUserById(message.createdBy.toHexString()) as WithId<UserModel>
      const modifiedBy = await getUserById(message.modifiedBy.toHexString()) as WithId<UserModel>

      return {
        id: message._id.toHexString(),
        folder: {
          id: folder._id.toHexString(),
          name: folder.name
        },
        body: message.body,
        recipient: recipient && {
          id: recipient._id.toHexString(),
          name: recipient.name,
          email: recipient.email
        },
        createdBy: {
          id: createdBy._id.toHexString(),
          name: createdBy.name,
          email: createdBy.email
        },
        createdOn: message.createdOn,
        modifiedBy: {
          id: modifiedBy._id.toHexString(),
          name: modifiedBy.name,
          email: modifiedBy.email
        },
        modifiedOn: message.modifiedOn
      }
    }))

    return new Response(
      JSON.stringify({
        messages: messagesResponse
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