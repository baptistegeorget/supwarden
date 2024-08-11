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
  folder: { id: string, name: string },
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
  folder: { id: string, name: string },
  user: UserResponse,
  status: "pending" | "accepted" | "rejected",
  creator: UserResponse,
  createdOn: string,
  modifier: UserResponse,
  modifiedOn: string
}

export type ElementModel = {
  folderId: ObjectId,
  name: string,
  identifier?: string,
  password?: string,
  urls?: string[],
  note?: string,
  customFields?: { type: "visible" | "hidden" | "attachment", value: string }[],
  idsOfMembersWhoCanEdit?: string[],
  isSensitive?: boolean,
  creatorId: ObjectId,
  createdOn: string,
  modifierId: ObjectId,
  modifiedOn: string
}

export type ElementResponse = {
  id: string,
  folder: { id: string, name: string },
  name: string,
  identifier?: string,
  password?: string,
  urls?: string[],
  note?: string,
  customFields?: { type: "visible" | "hidden" | "attachment", value: string }[],
  membersWhoCanEdit?: UserResponse[],
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