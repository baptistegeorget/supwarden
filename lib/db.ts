import clientPromise from "@/lib/mongodb"
import { FolderModel, InvitationModel, UserModel } from "@/types"
import { ObjectId, WithId } from "mongodb"

// Checks

export async function checkEmailIsUsed(email: string) {
  const client = await clientPromise

  const db = client.db()

  const usersCollection = db.collection<UserModel>("users")

  const user = await usersCollection.findOne({ email })

  return !!user
}

export async function checkPendingInvitationExist(userId: string, folderId: string) {
  const client = await clientPromise

  const db = client.db()

  const invitationsCollection = db.collection<InvitationModel>("invitations")

  const invitation = await invitationsCollection.findOne({
    userId: new ObjectId(userId),
    folderId: new ObjectId(folderId),
    status: "pending"
  })

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

export async function updateInvitation(invitation: WithId<InvitationModel>) {
  const client = await clientPromise

  const db = client.db()

  const invitationsCollection = db.collection<InvitationModel>("invitations")

  const result = await invitationsCollection.updateOne({ _id: invitation._id }, { $set: invitation })

  return result
}

// Getters

export async function getUserById(id: string) {
  const client = await clientPromise

  const db = client.db()

  const usersCollection = db.collection<UserModel>("users")

  const user = await usersCollection.findOne({ _id: new ObjectId(id) }, { projection: { password: 0, pin: 0 } })

  return user
}

export async function getFolderById(id: string) {
  const client = await clientPromise

  const db = client.db()

  const foldersCollection = db.collection<FolderModel>("folders")

  const folder = await foldersCollection.findOne({ _id: new ObjectId(id) })

  return folder
}

export async function getInvitationById(id: string) {
  const client = await clientPromise

  const db = client.db()

  const invitationsCollection = db.collection<InvitationModel>("invitations")

  const invitation = await invitationsCollection.findOne({ _id: new ObjectId(id) })

  return invitation
}

// Other getters

export async function getUserByCredentials(email: string, password: string) {
  const client = await clientPromise

  const db = client.db()

  const usersCollection = db.collection<UserModel>("users")

  const user = await usersCollection.findOne({ email, password }, { projection: { password: 0, pin: 0 } })

  return user
}

export async function getFoldersByUserId(userId: string) {
  const client = await clientPromise

  const db = client.db()

  const foldersCollection = db.collection<FolderModel>("folders")

  const folders = await foldersCollection.find({ memberIds: { $in: [userId] } }).toArray()

  return folders
}

export async function getUserByEmail(email: string) {
  const client = await clientPromise

  const db = client.db()

  const usersCollection = db.collection<UserModel>("users")

  const user = await usersCollection.findOne({ email }, { projection: { password: 0, pin: 0 } })

  return user
}

export async function getPendingInvitationsByUserId(userId: string) {
  const client = await clientPromise

  const db = client.db()

  const invitationsCollection = db.collection<InvitationModel>("invitations")

  const invitations = await invitationsCollection.find({ userId: new ObjectId(userId), status: "pending" }).toArray()

  return invitations
}