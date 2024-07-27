import clientPromise from "@/lib/mongodb"
import { Folder, User } from "@/types"
import { ObjectId } from "mongodb"

export async function checkEmailIsUsed(email: string) {
  const client = await clientPromise

  const db = client.db()

  const usersCollection = db.collection<User>("users")

  const user = await usersCollection.findOne({ email })

  return !!user
}

export async function createUser(user: User) {
  const client = await clientPromise

  const db = client.db()

  const usersCollection = db.collection<User>("users")

  const result = await usersCollection.insertOne(user)

  return result
}

export async function getUserByCredentials(email: string, password: string) {
  const client = await clientPromise

  const db = client.db()

  const usersCollection = db.collection<User>("users")

  const user = await usersCollection.findOne({ email, password }, { projection: { password: 0, pin: 0 } })

  return user
}

export async function getUserById(id: string) {
  const client = await clientPromise

  const db = client.db()

  const usersCollection = db.collection<User>("users")

  const user = await usersCollection.findOne({ _id: new ObjectId(id) }, { projection: { password: 0, pin: 0 } })

  return user
}

export async function createFolder(folder: Folder) {
  const client = await clientPromise

  const db = client.db()

  const foldersCollection = db.collection<Folder>("folders")

  const result = await foldersCollection.insertOne(folder)

  return result
}

export async function getFoldersByUserId(userId: string) {
  const client = await clientPromise

  const db = client.db()

  const foldersCollection = db.collection<Folder>("folders")

  const folders = await foldersCollection.find({
    $or: [
      { createdBy: new ObjectId(userId) },
      { members: { $in: [new ObjectId(userId)] } }
    ]
  }).toArray()

  return folders
}