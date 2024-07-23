import { signUpSchema } from "@/lib/zod"
import { checkEmailIsUsed, createUser } from "@/lib/db"
import { hashPassword } from "@/lib/password"
import { ZodError } from "zod"
import { User } from "@/types"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { email, password, firstName, lastName } = await signUpSchema.parseAsync(body)

    const emailIsUsed = await checkEmailIsUsed(email)

    if (emailIsUsed) {
      return Response.json({ error: "Email is already used" }, { status: 400 })
    }

    const user: User = {
      firstName: firstName.toLowerCase(),
      lastName: lastName.toLowerCase(),
      email: email.toLowerCase(),
      password: hashPassword(password)
    }

    await createUser(user)

    return Response.json(null, { status: 201 })
  } catch (error) {
    if (error instanceof ZodError) {
      return Response.json({ error: error.errors }, { status: 400 })
    }
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 400 })
    }
  }
}