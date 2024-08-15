import clientPromise from "@/lib/mongodb"
import { ElementModel, FolderModel, InvitationModel, MemberModel, SessionModel, UserModel } from "@/types"
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

export async function createMember(member: MemberModel) {
  const client = await clientPromise

  const db = client.db()

  const membersCollection = db.collection<MemberModel>("members")

  const result = await membersCollection.insertOne(member)

  return result
}

export async function createInvitation(invitation: InvitationModel) {
  const client = await clientPromise

  const db = client.db()

  const invitationsCollection = db.collection<InvitationModel>("invitations")

  const result = await invitationsCollection.insertOne(invitation)

  return result
}

export async function createElement(element: ElementModel) {
  const client = await clientPromise

  const db = client.db()

  const elementsCollection = db.collection<ElementModel>("elements")

  const result = await elementsCollection.insertOne(element)

  return result
}

export async function createSession(session: SessionModel) {
  const client = await clientPromise

  const db = client.db()

  const sessionsCollection = db.collection<SessionModel>("sessions")

  const result = await sessionsCollection.insertOne(session)

  return result
}

// Updates

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

export async function getMemberById(id: string) {
  const client = await clientPromise

  const db = client.db()

  const membersCollection = db.collection<MemberModel>("members")

  const member = await membersCollection.findOne({ _id: new ObjectId(id) })

  return member
}

export async function getUserByCredentials(email: string, password: string) {
  const client = await clientPromise

  const db = client.db()

  const usersCollection = db.collection<UserModel>("users")

  const user = await usersCollection.findOne({ email, password, status: "active" }, { projection: { password: 0, pin: 0 } })

  return user
}

export async function getFoldersByUserId(userId: string) {
  const client = await clientPromise

  const db = client.db()

  const membersCollection = db.collection<MemberModel>("members")

  const members = await membersCollection.find({ userId: new ObjectId(userId) }).toArray()

  const foldersCollection = db.collection<FolderModel>("folders")

  const folders: WithId<FolderModel>[] = []

  for (const member of members) {
    const folder = await foldersCollection.findOne({ _id: member.folderId })

    if (folder) {
      folders.push(folder)
    }
  }

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

export async function getElementsByFolderId(folderId: string) {
  const client = await clientPromise

  const db = client.db()

  const elementsCollection = db.collection<ElementModel>("elements")

  const elements = await elementsCollection.find({ folderId: new ObjectId(folderId) }).toArray()

  return elements
}

export async function getMembersByFolderId(folderId: string) {
  const client = await clientPromise

  const db = client.db()

  const membersCollection = db.collection<MemberModel>("members")

  const members = await membersCollection.find({ folderId: new ObjectId(folderId) }).toArray()

  return members
}

export async function getMemberByInformations(userId: string, folderId: string) {
  const client = await clientPromise

  const db = client.db()

  const membersCollection = db.collection<MemberModel>("members")

  const member = await membersCollection.findOne({ userId: new ObjectId(userId), folderId: new ObjectId(folderId) })

  return member
}