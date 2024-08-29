import clientPromise from "@/lib/mongodb"
import { ElementModel, FolderModel, InvitationModel, MemberModel, SessionModel, UserModel } from "@/types"
import { ObjectId, WithId } from "mongodb"

export async function checkIfEmailIsUsed(email: string) {
  const client = await clientPromise

  const db = client.db()

  const usersCollection = db.collection<UserModel>("users")

  const user = await usersCollection.findOne({ email })

  return !!user
}

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

export async function getUserByCredentials(email: string, password: string) {
  const client = await clientPromise

  const db = client.db()

  const usersCollection = db.collection<UserModel>("users")

  const user = await usersCollection.findOne({ email, password })

  return user
}

export async function createSession(session: SessionModel) {
  const client = await clientPromise

  const db = client.db()

  const sessionsCollection = db.collection<SessionModel>("sessions")

  const result = await sessionsCollection.insertOne(session)

  return result
}

export async function getUserById(id: string) {
  const client = await clientPromise

  const db = client.db()

  const usersCollection = db.collection<UserModel>("users")

  const user = await usersCollection.findOne({ _id: new ObjectId(id) })

  return user
}

export async function createMember(member: MemberModel) {
  const client = await clientPromise

  const db = client.db()

  const membersCollection = db.collection<MemberModel>("members")

  const result = await membersCollection.insertOne(member)

  return result
}

export async function getFoldersByUserId(id: string) {
  const client = await clientPromise

  const db = client.db()

  const membersCollection = db.collection<MemberModel>("members")

  const members = await membersCollection.find({ user: new ObjectId(id) }).toArray()

  const foldersCollection = db.collection<FolderModel>("folders")

  const folders = await foldersCollection.find({ _id: { $in: members.map(member => member.folder) } }).toArray()

  return folders
}

export async function getFolderById(id: string) {
  const client = await clientPromise

  const db = client.db()

  const foldersCollection = db.collection<FolderModel>("folders")

  const folder = await foldersCollection.findOne({ _id: new ObjectId(id) })

  return folder
}

export async function checkIfMemberExist(userId: string, folderId: string) {
  const client = await clientPromise

  const db = client.db()

  const membersCollection = db.collection<MemberModel>("members")

  const member = await membersCollection.findOne({ user: new ObjectId(userId), folder: new ObjectId(folderId) })

  return !!member
}

export async function getUserByEmail(email: string) {
  const client = await clientPromise

  const db = client.db()

  const usersCollection = db.collection<UserModel>("users")

  const user = await usersCollection.findOne({ email })

  return user
}

export async function checkIfPendingInvitationExist(userId: string, folderId: string) {
  const client = await clientPromise

  const db = client.db()

  const invitationsCollection = db.collection<InvitationModel>("invitations")

  const invitation = await invitationsCollection.findOne({ user: new ObjectId(userId), folder: new ObjectId(folderId), status: "pending" })

  return !!invitation
}

export async function createInvitation(invitation: InvitationModel) {
  const client = await clientPromise

  const db = client.db()

  const invitationsCollection = db.collection<InvitationModel>("invitations")

  const result = await invitationsCollection.insertOne(invitation)

  return result
}

export async function getPendingInvitationsByUserId(id: string) {
  const client = await clientPromise

  const db = client.db()

  const invitationsCollection = db.collection<InvitationModel>("invitations")

  const invitations = await invitationsCollection.find({ user: new ObjectId(id), status: "pending" }).toArray()

  return invitations
}

export async function getInvitationById(id: string) {
  const client = await clientPromise

  const db = client.db()

  const invitationsCollection = db.collection<InvitationModel>("invitations")

  const invitation = await invitationsCollection.findOne({ _id: new ObjectId(id) })

  return invitation
}

export async function updateInvitation(invitation: WithId<InvitationModel>) {
  const client = await clientPromise

  const db = client.db()

  const invitationsCollection = db.collection<InvitationModel>("invitations")

  const result = await invitationsCollection.updateOne({ _id: invitation._id }, { $set: invitation })

  return result
}

export async function getMembersByFolderId(id: string) {
  const client = await clientPromise

  const db = client.db()

  const membersCollection = db.collection<MemberModel>("members")

  const members = await membersCollection.find({ folder: new ObjectId(id) }).toArray()

  return members
}

export async function createElement(element: ElementModel) {
  const client = await clientPromise

  const db = client.db()

  const elementsCollection = db.collection<ElementModel>("elements")

  const result = await elementsCollection.insertOne(element)

  return result
}

export async function getElementsByFolderId(id: string) {
  const client = await clientPromise

  const db = client.db()

  const elementsCollection = db.collection<ElementModel>("elements")

  const elements = await elementsCollection.find({ folder: new ObjectId(id) }).toArray()

  return elements
}

export async function getElementById(id: string) {
  const client = await clientPromise

  const db = client.db()

  const elementsCollection = db.collection<ElementModel>("elements")

  const element = await elementsCollection.findOne({ _id: new ObjectId(id) })

  return element
}

export async function updateElement(element: WithId<ElementModel>) {
  const client = await clientPromise

  const db = client.db()

  const elementsCollection = db.collection<ElementModel>("elements")

  const result = await elementsCollection.updateOne({ _id: element._id }, { $set: element })

  return result
}

export async function deleteElement(element: WithId<ElementModel>) {
  const client = await clientPromise

  const db = client.db()

  const elementsCollection = db.collection<ElementModel>("elements")

  const result = await elementsCollection.deleteOne({ _id: element._id })

  return result
}