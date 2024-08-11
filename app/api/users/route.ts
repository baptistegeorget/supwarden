import { signUpSchema } from "@/lib/zod"
import { checkEmailIsUsed, createFolder, createMember, createUser } from "@/lib/db"
import { hashPassword } from "@/lib/password"
import { ZodError } from "zod"
import { FolderModel, MemberModel, UserModel } from "@/types"

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

    const userModel: UserModel = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashPassword(password),
      status: "active",
      createdOn: new Date().toISOString(),
      modifiedOn: new Date().toISOString()
    }

    const userResult = await createUser(userModel)

    const folderModel: FolderModel = {
      name: "Personal",
      type: "personal",
      creatorId: userResult.insertedId,
      createdOn: new Date().toISOString(),
      modifierId: userResult.insertedId,
      modifiedOn: new Date().toISOString()
    }

    const folderResult = await createFolder(folderModel)

    const memberModel: MemberModel = {
      folderId: folderResult.insertedId,
      userId: userResult.insertedId,
      creatorId: userResult.insertedId,
      createdOn: new Date().toISOString(),
      modifierId: userResult.insertedId,
      modifiedOn: new Date().toISOString()
    }

    await createMember(memberModel)

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