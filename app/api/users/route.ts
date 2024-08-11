import { signUpSchema } from "@/lib/zod"
import { checkEmailIsUsed, createFolder, createUser } from "@/lib/db"
import { hashPassword } from "@/lib/password"
import { ZodError } from "zod"
import { FolderModel, UserModel } from "@/types"

/**
 * Create a new user account and personal folder for the user.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { firstName, lastName, email, password, passwordConfirmation } = await signUpSchema.parseAsync(body)

    if (password !== passwordConfirmation) {
      return Response.json({ error: "Passwords do not match" }, { status: 400 })
    }

    const emailIsUsed = await checkEmailIsUsed(email)

    if (emailIsUsed) {
      return Response.json({ error: "Email is already used" }, { status: 400 })
    }

    const user: UserModel = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashPassword(password),
      status: "active",
      createdOn: new Date().toISOString(),
      modifiedOn: new Date().toISOString(),
    }

    const result = await createUser(user)

    const folder: FolderModel = {
      name: "Personal",
      type: "personal",
      memberIds: [result.insertedId.toString()],
      creatorId: result.insertedId,
      createdOn: new Date().toISOString(),
      modifierId: result.insertedId,
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
    return Response.json({ error: "An error occurred" }, { status: 500 })
  }
}