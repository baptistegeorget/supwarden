import { ElementModel, FolderModel, InvitationModel, MemberModel, MessageModel, SessionModel, UserModel } from "@/types"
import { ObjectId, WithId, MongoClient } from "mongodb"

if (!process.env.MONGODB_URI) {
  throw new Error("Invalid/Missing environment variable: MONGODB_URI")
}

const client = new MongoClient(process.env.MONGODB_URI)

export async function checkIfEmailIsUsed(email: string) {
  const db = client.db()

  const usersCollection = db.collection<UserModel>("users")

  const user = await usersCollection.findOne({ email })

  return !!user
}

export async function createUser(user: UserModel) {
  const db = client.db()

  const usersCollection = db.collection<UserModel>("users")

  const result = await usersCollection.insertOne(user)

  return result
}

export async function createFolder(folder: FolderModel) {
  const db = client.db()

  const foldersCollection = db.collection<FolderModel>("folders")

  const result = await foldersCollection.insertOne(folder)

  return result
}

export async function getUserByCredentials(email: string, password: string) {
  const db = client.db()

  const usersCollection = db.collection<UserModel>("users")

  const user = await usersCollection.findOne({ email, password })

  return user
}

export async function createSession(session: SessionModel) {
  const db = client.db()

  const sessionsCollection = db.collection<SessionModel>("sessions")

  const result = await sessionsCollection.insertOne(session)

  return result
}

export async function getUserById(id: string) {
  const db = client.db()

  const usersCollection = db.collection<UserModel>("users")

  const user = await usersCollection.findOne({ _id: new ObjectId(id) })

  return user
}

export async function createMember(member: MemberModel) {
  const db = client.db()

  const membersCollection = db.collection<MemberModel>("members")

  const result = await membersCollection.insertOne(member)

  return result
}

export async function getFoldersByUserId(id: string) {
  const db = client.db()

  const membersCollection = db.collection<MemberModel>("members")

  const members = await membersCollection.find({ user: new ObjectId(id) }).toArray()

  const foldersCollection = db.collection<FolderModel>("folders")

  const folders = await foldersCollection.find({ _id: { $in: members.map(member => member.folder) } }).toArray()

  return folders
}

export async function getFolderById(id: string) {
  const db = client.db()

  const foldersCollection = db.collection<FolderModel>("folders")

  const folder = await foldersCollection.findOne({ _id: new ObjectId(id) })

  return folder
}

export async function checkIfMemberExist(userId: string, folderId: string) {
  const db = client.db()

  const membersCollection = db.collection<MemberModel>("members")

  const member = await membersCollection.findOne({ user: new ObjectId(userId), folder: new ObjectId(folderId) })

  return !!member
}

export async function getUserByEmail(email: string) {
  const db = client.db()

  const usersCollection = db.collection<UserModel>("users")

  const user = await usersCollection.findOne({ email })

  return user
}

export async function checkIfPendingInvitationExist(userId: string, folderId: string) {
  const db = client.db()

  const invitationsCollection = db.collection<InvitationModel>("invitations")

  const invitation = await invitationsCollection.findOne({ user: new ObjectId(userId), folder: new ObjectId(folderId), status: "pending" })

  return !!invitation
}

export async function createInvitation(invitation: InvitationModel) {
  const db = client.db()

  const invitationsCollection = db.collection<InvitationModel>("invitations")

  const result = await invitationsCollection.insertOne(invitation)

  return result
}

export async function getPendingInvitationsByUserId(id: string) {
  const db = client.db()

  const invitationsCollection = db.collection<InvitationModel>("invitations")

  const invitations = await invitationsCollection.find({ user: new ObjectId(id), status: "pending" }).toArray()

  return invitations
}

export async function getInvitationById(id: string) {
  const db = client.db()

  const invitationsCollection = db.collection<InvitationModel>("invitations")

  const invitation = await invitationsCollection.findOne({ _id: new ObjectId(id) })

  return invitation
}

export async function updateInvitation(invitation: WithId<InvitationModel>) {
  const db = client.db()

  const invitationsCollection = db.collection<InvitationModel>("invitations")

  const result = await invitationsCollection.updateOne({ _id: invitation._id }, { $set: invitation })

  return result
}

export async function getMembersByFolderId(id: string) {
  const db = client.db()

  const membersCollection = db.collection<MemberModel>("members")

  const members = await membersCollection.find({ folder: new ObjectId(id) }).toArray()

  return members
}

export async function createElement(element: ElementModel) {
  const db = client.db()

  const elementsCollection = db.collection<ElementModel>("elements")

  const result = await elementsCollection.insertOne(element)

  return result
}

export async function getElementsByFolderId(id: string, query?: string) {
  const db = client.db()

  const elementsCollection = db.collection<ElementModel>("elements")

  const elements = await elementsCollection.find({
    folder: new ObjectId(id),
    $or: [
      { name: { $regex: query, $options: "i" } },
      { urls: { $elemMatch: { $regex: query, $options: "i" } } }
    ]
  }).toArray()

  return elements
}

export async function getElementById(id: string) {
  const db = client.db()

  const elementsCollection = db.collection<ElementModel>("elements")

  const element = await elementsCollection.findOne({ _id: new ObjectId(id) })

  return element
}

export async function updateElement(element: WithId<ElementModel>) {
  const db = client.db()

  const elementsCollection = db.collection<ElementModel>("elements")

  const result = await elementsCollection.updateOne({ _id: element._id }, { $set: element })

  return result
}

export async function deleteElement(element: WithId<ElementModel>) {
  const db = client.db()

  const elementsCollection = db.collection<ElementModel>("elements")

  const result = await elementsCollection.deleteOne({ _id: element._id })

  return result
}

export async function updateUser(user: WithId<UserModel>) {
  const db = client.db()

  const usersCollection = db.collection<UserModel>("users")

  const result = await usersCollection.updateOne({ _id: user._id }, { $set: user })

  return result
}

export async function createMessage(message: MessageModel) {
  const db = client.db()

  const messagesCollection = db.collection<MessageModel>("messages")

  const result = await messagesCollection.insertOne(message)

  return result
}

export async function getMessagesByFolderId(id: string) {
  const db = client.db()

  const messagesCollection = db.collection<MessageModel>("messages")

  const messages = await messagesCollection.find({ folder: new ObjectId(id) }).toArray()

  return messages
}

export async function getElementToExport(id: string) {
  const db = client.db()

  const elementsCollection = db.collection<ElementModel>("elements")

  const elements = await elementsCollection.find({ createdBy: new ObjectId(id) }).toArray()

  return elements
}