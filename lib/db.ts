import clientPromise from "@/lib/mongodb"
import { User } from "@/types"
import { ObjectId } from "mongodb"

export async function checkEmailIsUsed(email: string) {
  const client = await clientPromise

  const db = client.db()

  const users = db.collection<User>("users")

  const user = await users.findOne({ email })

  return !!user
}

export async function createUser(user: User) {
  const client = await clientPromise

  const db = client.db()

  const users = db.collection<User>("users")

  const result = await users.insertOne(user)
  
  return result
}

export async function getUserByCredentials(email: string, password: string) {
  const client = await clientPromise

  const db = client.db()

  const users = db.collection<User>("users")

  const user = await users.findOne({ email, password }, { projection: { password: 0 } })

  return user
}

export async function getUserById(id: string) {
  const client = await clientPromise

  const db = client.db()

  const users = db.collection<User>("users")

  const user = await users.findOne({ _id: new ObjectId(id) }, { projection: { password: 0 } })

  return user
}