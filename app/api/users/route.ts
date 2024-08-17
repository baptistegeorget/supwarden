import { signUpSchema } from "@/lib/zod"
import { checkEmailIsUsed, createFolder, createUser } from "@/lib/db"
import { hashPassword } from "@/lib/password"
import { ZodError } from "zod"
import { FolderModel, UserModel, UserResponse } from "@/types"

export async function POST(request: Request) {
  try {
    // Get and parse the body
    const body = await request.json()
    const data = await signUpSchema.parseAsync(body)

    // Check if the email is already used
    const emailIsUsed = await checkEmailIsUsed(data.email)

    if (emailIsUsed) {
      return new Response(
        JSON.stringify({
          error: "The email is already used"
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
    }

    // Create the user
    const userModel: UserModel = {
      name: data.name,
      email: data.email,
      password: hashPassword(data.password),
      createdOn: new Date().toISOString(),
      modifiedOn: new Date().toISOString()
    }

    const user = await createUser(userModel)

    // Create the personal folder for the user
    const folderModel: FolderModel = {
      name: "Personal",
      type: "personal",
      createdBy: user.insertedId,
      createdOn: new Date().toISOString(),
      modifiedBy: user.insertedId,
      modifiedOn: new Date().toISOString()
    }

    await createFolder(folderModel)

    // Return the response
    const userResponse: UserResponse = {
      id: user.insertedId.toHexString(),
      name: userModel.name,
      email: userModel.email,
      createdOn: userModel.createdOn,
      modifiedOn: userModel.modifiedOn
    }

    return new Response(
      JSON.stringify({
        message: "User created successfully",
        user: userResponse
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
          "Location": `/users/${user.insertedId}`
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
          status: 400,
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
    }
    return new Response(
      JSON.stringify({
        error: "An unexpected error occurred"
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