import clientPromise from "@/lib/mongodb"
import { User } from "@/types"

export async function checkEmailIsUsed(email: string) {
  const client = await clientPromise

  const db = client.db()

  const users = db.collection<User>("users")

  const user = await users.findOne({ email })

  return !!user
}

export async function createUser(firstName: string, lastName: string, email: string, password: string) {
  const client = await clientPromise

  const db = client.db()

  const users = db.collection<User>("users")

  const user = await users.insertOne({ firstName, lastName, email, password })

  return user.insertedId.toString()
}

export async function getUserByEmail(email: string) {
  const client = await clientPromise

  const db = client.db()

  const users = db.collection<User>("users")

  const user = await users.findOne({ email })

  return user
}