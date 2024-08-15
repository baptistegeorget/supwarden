import { ObjectId } from "mongodb"

export type UserModel = {
  lastName: string,
  firstName: string,
  email: string,
  password: string,
  pin?: string,
  status: "active" | "disabled" | "deleted",
  createdOn: string,
  modifiedOn: string
}

export type UserResponse = {
  id: string,
  lastName: string,
  firstName: string,
  email: string,
  createdOn: string,
  modifiedOn: string
}

export type FolderModel = {
  name: string,
  type: "personal" | "shared",
  creatorId: ObjectId,
  createdOn: string,
  modifierId: ObjectId,
  modifiedOn: string
}

export type FolderResponse = {
  id: string,
  name: string,
  type: "personal" | "shared",
  creator: UserResponse,
  createdOn: string,
  modifier: UserResponse,
  modifiedOn: string
}

export type MemberModel = {
  folderId: ObjectId,
  userId: ObjectId,
  creatorId: ObjectId,
  createdOn: string,
  modifierId: ObjectId,
  modifiedOn: string
}

export type MemberResponse = {
  id: string,
  user: UserResponse,
  creator: UserResponse,
  createdOn: string,
  modifier: UserResponse,
  modifiedOn: string
}

export type InvitationModel = {
  folderId: ObjectId,
  userId: ObjectId,
  status: "pending" | "accepted" | "rejected",
  creatorId: ObjectId,
  createdOn: string,
  modifierId: ObjectId,
  modifiedOn: string
}

export type InvitationResponse = {
  id: string,
  folder: FolderResponse,
  user: UserResponse,
  status: "pending" | "accepted" | "rejected",
  creator: UserResponse,
  createdOn: string,
  modifier: UserResponse,
  modifiedOn: string
}

export type CustomField = {
  type: "visible" | "hidden" | "attachment",
  value: string | { name: string, data: string }
}

export type ElementModel = {
  folderId: ObjectId,
  name: string,
  identifier?: string,
  password?: string,
  urls?: string[],
  note?: string,
  customFields?: CustomField[],
  idsOfMembersWhoCanEdit?: string[],
  isSensitive?: boolean,
  creatorId: ObjectId,
  createdOn: string,
  modifierId: ObjectId,
  modifiedOn: string
}

export type ElementResponse = {
  id: string,
  name: string,
  identifier?: string,
  password?: string,
  urls?: string[],
  note?: string,
  customFields?: CustomField[],
  membersWhoCanEdit?: MemberResponse[],
  isSensitive?: boolean,
  creator: UserResponse,
  createdOn: string,
  modifier: UserResponse,
  modifiedOn: string
}

export type SessionModel = {
  userId: ObjectId,
  date: string
}

export type SessionResponse = {
  id: string,
  user: UserResponse,
  date: string
}