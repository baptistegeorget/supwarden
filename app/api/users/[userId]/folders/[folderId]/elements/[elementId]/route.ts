import { getSession } from "@/lib/auth"
import { checkIfMemberExist, deleteElement, getElementById, getFolderById, getUserById, updateElement } from "@/lib/db"
import { elementSchema } from "@/lib/zod"
import { ElementResponse, UserModel } from "@/types"
import { WithId } from "mongodb"
import { ZodError } from "zod"
import CryptoJS from "crypto-js"

if (!process.env.ENCRYPTION_KEY) {
  throw new Error("Invalid/Missing environment variable: ENCRYPTION_KEY")
}

const encryptionKey = process.env.ENCRYPTION_KEY

export async function PUT(request: Request, { params }: { params: { userId: string, folderId: string, elementId: string } }) {
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

    // Get the element
    const element = await getElementById(params.elementId)

    if (!element) {
      return new Response(
        JSON.stringify({
          error: "Element not found"
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
    }

    // Check if the user has authorization to update the element
    if (folder.createdBy.toHexString() !== user._id.toHexString() && element.createdBy.toHexString() !== user._id.toHexString() && !element.idsOfMembersWhoCanEdit.includes(user._id.toHexString())) {
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

    // Get and parse the body
    const body = await request.json()
    const data = await elementSchema.parseAsync(body)

    // Update the element
    element.name = data.name
    element.identifier = data.identifier
    element.password = CryptoJS.AES.encrypt(data.password, encryptionKey).toString()
    element.urls = data.urls
    element.note = data.note
    element.customFields = data.customFields.map((customField) => {
      if (customField.type !== "hidden") return customField
      return { ...customField, value: CryptoJS.AES.encrypt(customField.value as string, encryptionKey).toString() }
    })
    element.idsOfMembersWhoCanEdit = data.idsOfMembersWhoCanEdit
    element.isSensitive = data.isSensitive
    element.modifiedBy = user._id
    element.modifiedOn = new Date().toISOString()

    await updateElement(element)

    // Return the response
    const createdBy = await getUserById(element.createdBy.toHexString()) as WithId<UserModel>
    const modifiedBy = await getUserById(element.modifiedBy.toHexString()) as WithId<UserModel>

    const elementResponse: ElementResponse = {
      id: element._id.toHexString(),
      folder: {
        id: folder._id.toHexString(),
        name: folder.name
      },
      name: element.name,
      identifier: element.identifier,
      password: CryptoJS.AES.decrypt(element.password, encryptionKey).toString(CryptoJS.enc.Utf8),
      urls: element.urls,
      note: element.note,
      customFields: element.customFields.map((customField) => {
        if (customField.type !== "hidden") return customField
        return { ...customField, value: CryptoJS.AES.decrypt(customField.value as string, encryptionKey).toString(CryptoJS.enc.Utf8) }
      }),
      idsOfMembersWhoCanEdit: element.idsOfMembersWhoCanEdit,
      isSensitive: element.isSensitive,
      createdBy: {
        id: createdBy._id.toHexString(),
        name: createdBy.name,
        email: createdBy.email
      },
      createdOn: element.createdOn,
      modifiedBy: {
        id: modifiedBy._id.toHexString(),
        name: modifiedBy.name,
        email: modifiedBy.email
      },
      modifiedOn: element.modifiedOn
    }

    return new Response(
      JSON.stringify({
        message: "Element updated successfully",
        element: elementResponse
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json"
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

export async function DELETE(request: Request, { params }: { params: { userId: string, folderId: string, elementId: string } }) {
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

    // Get the element
    const element = await getElementById(params.elementId)

    if (!element) {
      return new Response(
        JSON.stringify({
          error: "Element not found"
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
    }

    // Check if the user has authorization to update the element
    if (folder.createdBy.toHexString() !== user._id.toHexString() && element.createdBy.toHexString() !== user._id.toHexString() && !element.idsOfMembersWhoCanEdit.includes(user._id.toHexString())) {
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

    // Delete the element
    await deleteElement(element)

    // Return the response
    return new Response(
      JSON.stringify({
        message: "Element deleted successfully"
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