import { signUpSchema } from "@/lib/zod"
import { checkEmailIsUsed, createFolder, createUser } from "@/lib/db"
import { hashPassword } from "@/lib/password"
import { ZodError } from "zod"
import { Folder, User } from "@/types"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { email, password, firstName, lastName } = await signUpSchema.parseAsync(body)

    const emailIsUsed = await checkEmailIsUsed(email)

    if (emailIsUsed) {
      return Response.json({ error: "Email is already used" }, { status: 400 })
    }

    const user: User = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashPassword(password),
      createdOn: new Date().toISOString(),
      modifiedOn: new Date().toISOString(),
    }

    const result = await createUser(user)

    const folder: Folder = {
      name: "Personal",
      type: "personal",
      createdBy: result.insertedId,
      createdOn: new Date().toISOString(),
      modifiedBy: result.insertedId,
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