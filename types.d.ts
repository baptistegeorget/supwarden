import { ObjectId } from "mongodb"

export type UserModel = {
  // Properties
  lastName: string,
  firstName: string,
  email: string,
  password: string,
  pin?: string,
  status: "active" | "deleted",
  // Metadata
  createdOn: string,
  modifiedOn: string,
}

export type FolderModel = {
  // Properties
  name: string,
  type: "personal" | "shared",
  memberIds: string[],
  // Metadata
  creatorId: ObjectId,
  createdOn: string,
  modifierId: ObjectId,
  modifiedOn: string,
}

export type InvitationModel = {
  // Properties
  folderId: ObjectId,
  userId: ObjectId,
  status: "pending" | "accepted" | "rejected",
  // Metadata
  creatorId: ObjectId,
  createdOn: string,
  modifierId: ObjectId,
  modifiedOn: string,
}

export type ElementModel = {
  // Properties
  folderId: ObjectId,
  name: string,
  identifier?: string,
  password?: string,
  urls?: string[],
  note?: string,
  customFields?: { type: "visible" | "hidden" | "attachment", value: string }[],
  idsOfMembersWhoCanEdit?: string[],
  isSensitive?: boolean,
  // Metadata
  creatorId: ObjectId,
  createdOn: string,
  modifierId: ObjectId,
  modifiedOn: string,
}

export type Session = {
  user: { id: string, lastName: string, firstName: string, email: string },
  date: string,
}

export type User = {
  id: string,
  lastName: string,
  firstName: string,
  email: string,
  createdOn: string,
  modifiedOn: string,
}

export type Folder = {
  id: string,
  name: string,
  type: "personal" | "shared",
  members: ({ id: string, lastName: string, firstName: string, email: string } | null)[],
  creator: { id: string, lastName: string, firstName: string, email: string } | null,
  createdOn: string,
  modifier: { id: string, lastName: string, firstName: string, email: string } | null,
  modifiedOn: string,
}

export type Invitation = {
  id: string,
  folder: { id: string, name: string } | null,
  user: { id: string, lastName: string, firstName: string, email: string } | null,
  status: "pending" | "accepted" | "rejected",
  creator: { id: string, lastName: string, firstName: string, email: string } | null,
  createdOn: string,
  modifier: { id: string, lastName: string, firstName: string, email: string } | null,
  modifiedOn: string,
}