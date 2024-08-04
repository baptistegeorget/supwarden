import { ObjectId } from "mongodb"

// Table
export type User = {
  // Properties
  lastName: string,
  firstName: string,
  email: string,
  password: string,
  pin?: string,
  // Metadata
  createdOn: string,
  modifiedOn: string,
}

// Table
export type Folder = {
  // Properties
  name: string,
  type: "personal" | "shared",
  memberIds?: ObjectId[],
  // Metadata
  creatorId: ObjectId,
  createdOn: string,
  modifierId: ObjectId,
  modifiedOn: string,
}

// Table
export type Element = {
  // Properties
  folderId: ObjectId,
  name: string,
  identifier?: string,
  password?: string,
  urls?: string[],
  note?: string,
  customFields?: { type: "visible" | "hidden" | "attachment", value: string }[],
  IdsOfMembersWhoCanEdit?: ObjectId[],
  isSensitive?: boolean,
  // Metadata
  creatorId: ObjectId,
  createdOn: string,
  modifierId: ObjectId,
  modifiedOn: string,
}

// Table
export type Invitation = {
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

export type Session = {
  user: {
    id: string,
    email: string,
    name: string,
  }
}