import { ObjectId } from "mongodb"

/**
 * Type User for the database
 */
export type UserModel = {
  lastName: string,
  firstName: string,
  email: string,
  password: string,
  pin?: string,
  status: "active" | "disabled" | "deleted",
  createdOn: string,
  modifiedOn: string,
}

/**
 * Type Folder for the database
 */
export type FolderModel = {
  name: string,
  type: "personal" | "shared",
  memberIds: string[],
  creatorId: ObjectId,
  createdOn: string,
  modifierId: ObjectId,
  modifiedOn: string,
}

/**
 * Type Invitation for the database
 */
export type InvitationModel = {
  folderId: ObjectId,
  userId: ObjectId,
  status: "pending" | "accepted" | "rejected",
  creatorId: ObjectId,
  createdOn: string,
  modifierId: ObjectId,
  modifiedOn: string,
}

/**
 * Type Element for the database
 */
export type ElementModel = {
  folderId: ObjectId,
  name: string,
  identifier?: string,
  password?: string,
  urls: string[],
  note?: string,
  customFields: { type: "visible" | "hidden" | "attachment", value: string }[],
  idsOfMembersWhoCanEdit: string[],
  isSensitive: boolean,
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

export type Element = {
  id: string,
  folder: { id: string, name: string },
  name: string,
  identifier?: string,
  password?: string,
  urls?: string[],
  note?: string,
  customFields?: { type: "visible" | "hidden" | "attachment", value: string }[],
  membersWhoCanEdit?: ({ id: string, lastName: string, firstName: string, email: string } | null)[],
  isSensitive?: boolean,
  creator: { id: string, lastName: string, firstName: string, email: string } | null,
  createdOn: string,
  modifier: { id: string, lastName: string, firstName: string, email: string } | null,
  modifiedOn: string,
}