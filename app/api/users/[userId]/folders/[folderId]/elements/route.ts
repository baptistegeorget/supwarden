import { getSession } from "@/lib/auth"
import { createElement, getElementsByFolderId, getFolderById, getUserById, checkIfMemberExist } from "@/lib/db"
import { elementSchema } from "@/lib/zod"
import { ElementResponse, ElementModel, UserModel } from "@/types"
import { WithId } from "mongodb"
import { ZodError } from "zod"
import CryptoJS from "crypto-js"

if (!process.env.ENCRYPTION_KEY) {
  throw new Error("Invalid/Missing environment variable: ENCRYPTION_KEY")
}

const encryptionKey = process.env.ENCRYPTION_KEY

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

    // Get and parse the body
    const body = await request.json()
    const data = await elementSchema.parseAsync(body)

    // Check if the members exist
    data.idsOfMembersWhoCanEdit.forEach(async (id) => {
      const isMember = await checkIfMemberExist(id, folder._id.toHexString())

      if (!isMember) {
        return new Response(
          JSON.stringify({
            error: "Member not found"
          }),
          {
            status: 404,
            headers: {
              "Content-Type": "application/json"
            }
          }
        )
      }
    })

    // Create the element
    const elementModel: ElementModel = {
      folder: folder._id,
      name: data.name,
      identifier: data.identifier,
      password: CryptoJS.AES.encrypt(data.password, encryptionKey).toString(),
      urls: data.urls,
      note: data.note,
      customFields: data.customFields.map((customField) => {
        if (customField.type !== "hidden") return customField
        return { ...customField, value: CryptoJS.AES.encrypt(customField.value as string, encryptionKey).toString() }
      }),
      idsOfMembersWhoCanEdit: data.idsOfMembersWhoCanEdit,
      isSensitive: data.isSensitive,
      createdBy: user._id,
      createdOn: new Date().toISOString(),
      modifiedBy: user._id,
      modifiedOn: new Date().toISOString()
    }

    const element = await createElement(elementModel)

    // Return the response
    const elementResponse: ElementResponse = {
      id: element.insertedId.toHexString(),
      folder: {
        id: folder._id.toHexString(),
        name: folder.name
      },
      name: elementModel.name,
      identifier: elementModel.identifier,
      password: CryptoJS.AES.decrypt(elementModel.password, encryptionKey).toString(CryptoJS.enc.Utf8),
      urls: elementModel.urls,
      note: elementModel.note,
      customFields: elementModel.customFields.map((customField) => {
        if (customField.type !== "hidden") return customField
        return { ...customField, value: CryptoJS.AES.decrypt(customField.value as string, encryptionKey).toString(CryptoJS.enc.Utf8) }
      }),
      idsOfMembersWhoCanEdit: elementModel.idsOfMembersWhoCanEdit,
      isSensitive: elementModel.isSensitive,
      createdBy: {
        id: user._id.toHexString(),
        name: user.name,
        email: user.email
      },
      createdOn: elementModel.createdOn,
      modifiedBy: {
        id: user._id.toHexString(),
        name: user.name,
        email: user.email
      },
      modifiedOn: elementModel.modifiedOn
    }

    return new Response(
      JSON.stringify({
        message: "Element created successfully",
        element: elementResponse
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
          "Location": `/users/${user._id.toHexString()}/folders/${folder._id.toHexString()}/elements/${element.insertedId.toHexString()}`
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

export async function GET(_request: Request, { params }: { params: { userId: string, folderId: string } }) {
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

    // Get the elements
    const elements = await getElementsByFolderId(folder._id.toHexString())

    // Return the response
    const elementsResponse: ElementResponse[] = await Promise.all(elements.map(async (element) => {
      const createdBy = await getUserById(element.createdBy.toHexString()) as WithId<UserModel>
      const modifiedBy = await getUserById(element.modifiedBy.toHexString()) as WithId<UserModel>

      return {
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
    }))

    return new Response(
      JSON.stringify({
        elements: elementsResponse
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