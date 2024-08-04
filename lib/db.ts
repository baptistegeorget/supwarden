import clientPromise from "@/lib/mongodb"
import { Folder, Invitation, User } from "@/types"
import { ObjectId, WithId } from "mongodb"

// Checks

export async function checkEmailIsUsed(email: string) {
  const client = await clientPromise

  const db = client.db()

  const usersCollection = db.collection<User>("users")

  const user = await usersCollection.findOne({ email })

  return !!user
}

export async function checkInvitationExist(userId: ObjectId, folderId: ObjectId, status?: "pending" | "accepted" | "rejected") {
  const client = await clientPromise

  const db = client.db()

  const invitationsCollection = db.collection<Invitation>("invitations")

  const invitation = await invitationsCollection.findOne({ userId, folderId, ...(status ? { status } : {}) })

  return !!invitation
}

// Creations

export async function createUser(user: User) {
  const client = await clientPromise

  const db = client.db()

  const usersCollection = db.collection<User>("users")

  const result = await usersCollection.insertOne(user)

  return result
}

export async function createFolder(folder: Folder) {
  const client = await clientPromise

  const db = client.db()

  const foldersCollection = db.collection<Folder>("folders")

  const result = await foldersCollection.insertOne(folder)

  return result
}

export async function createInvitation(invitation: Invitation) {
  const client = await clientPromise

  const db = client.db()

  const invitationsCollection = db.collection<Invitation>("invitations")

  const result = await invitationsCollection.insertOne(invitation)

  return result
}

// Updates

export async function updateUser(user: WithId<User>) {
  const client = await clientPromise

  const db = client.db()

  const usersCollection = db.collection<User>("users")

  const result = await usersCollection.updateOne({ _id: user._id }, { $set: user })

  return result
}

export async function updateFolder(folder: WithId<Folder>) {
  const client = await clientPromise

  const db = client.db()

  const foldersCollection = db.collection<Folder>("folders")

  const result = await foldersCollection.updateOne({ _id: folder._id }, { $set: folder })

  return result
}

export async function updateInvitation(invitation: WithId<Invitation>) {
  const client = await clientPromise

  const db = client.db()

  const invitationsCollection = db.collection<Invitation>("invitations")

  const result = await invitationsCollection.updateOne({ _id: invitation._id }, { $set: invitation })

  return result
}

// Getters

export async function getUserByCredentials(email: string, password: string) {
  const client = await clientPromise

  const db = client.db()

  const usersCollection = db.collection<User>("users")

  const user = await usersCollection.findOne({ email, password }, { projection: { password: 0, pin: 0 } })

  return user
}

export async function getUserById(id: ObjectId) {
  const client = await clientPromise

  const db = client.db()

  const usersCollection = db.collection<User>("users")

  const user = await usersCollection.findOne({ _id: id }, { projection: { password: 0, pin: 0 } })

  return user
}

export async function getFoldersByUserId(id: ObjectId) {
  const client = await clientPromise

  const db = client.db()

  const foldersCollection = db.collection<Folder>("folders")

  const folders = await foldersCollection.find({
    $or: [
      { creatorId: id },
      { memberIds: { $in: [id] } }
    ]
  }).toArray()

  return folders
}

export async function getFolderById(id: ObjectId) {
  const client = await clientPromise

  const db = client.db()

  const foldersCollection = db.collection<Folder>("folders")

  const folder = await foldersCollection.findOne({ _id: id })

  return folder
}

export async function getUserByEmail(email: string) {
  const client = await clientPromise

  const db = client.db()

  const usersCollection = db.collection<User>("users")

  const user = await usersCollection.findOne({ email }, { projection: { password: 0, pin: 0 } })

  return user
}

export async function getInvitationsByUserId(id: ObjectId) {
  const client = await clientPromise

  const db = client.db()

  const invitationsCollection = db.collection<Invitation>("invitations")

  const invitations = await invitationsCollection.find({ userId: id }).toArray()

  return invitations
}

export async function getInvitationById(id: ObjectId) {
  const client = await clientPromise

  const db = client.db()

  const invitationsCollection = db.collection<Invitation>("invitations")

  const invitation = await invitationsCollection.findOne({ _id: id })

  return invitation
}