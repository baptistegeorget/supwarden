import { getSession } from "@/lib/auth"
import { getElementsByUserId, getFolderById, getUserById } from "@/lib/db"
import { ElementResponse, FolderModel, UserModel } from "@/types"
import { WithId } from "mongodb"
import CryptoJS from "crypto-js"

if (!process.env.ENCRYPTION_KEY) {
  throw new Error("Invalid/Missing environment variable: ENCRYPTION_KEY")
}

const encryptionKey = process.env.ENCRYPTION_KEY

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

    // Get elements to export
    const elements = await getElementsByUserId(user._id.toHexString())

    // Return the response
    const elementsResponse: ElementResponse[] = await Promise.all(elements.map(async (element) => {
      const folder = await getFolderById(element.folder.toHexString()) as WithId<FolderModel>
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