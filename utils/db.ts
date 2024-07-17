import clientPromise from "@/lib/mongodb"
import { User } from "next-auth"

export async function getUserWithCredentials(email: string, password: string) {
  const client = await clientPromise

  const db = client.db()

  const users = db.collection<User>("users")

  const user = await users.findOne({ email, password })

  if (!user) {
    return null
  }

  return user
}