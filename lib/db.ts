import clientPromise from "@/lib/mongodb"
import { FolderModel, InvitationModel, Session, UserModel } from "@/types"
import { ObjectId, WithId } from "mongodb"

// Checks

export async function checkEmailIsUsed(email: string) {
  const client = await clientPromise

  const db = client.db()

  const usersCollection = db.collection<UserModel>("users")

  const user = await usersCollection.findOne({ email })

  return !!user
}

export async function checkInvitationExist(userId: ObjectId, folderId: ObjectId, status?: "pending" | "accepted" | "rejected") {
  const client = await clientPromise

  const db = client.db()

  const invitationsCollection = db.collection<InvitationModel>("invitations")

  const invitation = await invitationsCollection.findOne({ userId, folderId, ...(status ? { status } : {}) })

  return !!invitation
}

// Creations

export async function createUser(user: UserModel) {
  const client = await clientPromise

  const db = client.db()

  const usersCollection = db.collection<UserModel>("users")

  const result = await usersCollection.insertOne(user)

  return result
}

export async function createFolder(folder: FolderModel) {
  const client = await clientPromise

  const db = client.db()

  const foldersCollection = db.collection<FolderModel>("folders")

  const result = await foldersCollection.insertOne(folder)

  return result
}

export async function createInvitation(invitation: InvitationModel) {
  const client = await clientPromise

  const db = client.db()

  const invitationsCollection = db.collection<InvitationModel>("invitations")

  const result = await invitationsCollection.insertOne(invitation)

  return result
}

// Updates

export async function updateUser(user: WithId<UserModel>) {
  const client = await clientPromise

  const db = client.db()

  const usersCollection = db.collection<UserModel>("users")

  const result = await usersCollection.updateOne({ _id: user._id }, { $set: user })

  return result
}

export async function updateFolder(folder: WithId<FolderModel>) {
  const client = await clientPromise

  const db = client.db()

  const foldersCollection = db.collection<FolderModel>("folders")

  const result = await foldersCollection.updateOne({ _id: folder._id }, { $set: folder })

  return result
}

export async function updateInvitation(invitation: WithId<InvitationModel>) {
  const client = await clientPromise

  const db = client.db()

  const invitationsCollection = db.collection<InvitationModel>("invitations")

  const result = await invitationsCollection.updateOne({ _id: invitation._id }, { $set: invitation })

  return result
}

// Getters

export async function getUserByCredentials(email: string, password: string) {
  const client = await clientPromise

  const db = client.db()

  const usersCollection = db.collection<UserModel>("users")

  const user = await usersCollection.findOne({ email, password, status: "active" }, { projection: { password: 0, pin: 0 } })

  return user
}

export async function getUserById(id: ObjectId) {
  const client = await clientPromise

  const db = client.db()

  const usersCollection = db.collection<UserModel>("users")

  const user = await usersCollection.findOne({ _id: id }, { projection: { password: 0, pin: 0 } })

  return user
}

export async function getFoldersByUserId(id: ObjectId) {
  const client = await clientPromise

  const db = client.db()

  const foldersCollection = db.collection<FolderModel>("folders")

  const folders = await foldersCollection.find({ memberIds: { $in: [id.toString()] } }).toArray()

  return folders
}

export async function getFolderById(id: ObjectId) {
  const client = await clientPromise

  const db = client.db()

  const foldersCollection = db.collection<FolderModel>("folders")

  const folder = await foldersCollection.findOne({ _id: id })

  return folder
}

export async function getUserByEmail(email: string) {
  const client = await clientPromise

  const db = client.db()

  const usersCollection = db.collection<UserModel>("users")

  const user = await usersCollection.findOne({ email }, { projection: { password: 0, pin: 0 } })

  return user
}

export async function getInvitationsByUserId(id: ObjectId) {
  const client = await clientPromise

  const db = client.db()

  const invitationsCollection = db.collection<InvitationModel>("invitations")

  const invitations = await invitationsCollection.find({ userId: id }).toArray()

  return invitations
}

export async function getInvitationById(id: ObjectId) {
  const client = await clientPromise

  const db = client.db()

  const invitationsCollection = db.collection<InvitationModel>("invitations")

  const invitation = await invitationsCollection.findOne({ _id: id })

  return invitation
}