import { ObjectId } from "mongodb"

export type UserModel = {
  name: string,
  email: string,
  password: string,
  pin?: string,
  createdOn: string,
  modifiedOn: string
}

export type UserResponse = {
  id: string,
  name: string,
  email: string,
  createdOn: string,
  modifiedOn: string
}

export type FolderModel = {
  name: string,
  type: "personal" | "shared",
  createdBy: ObjectId,
  createdOn: string,
  modifiedBy: ObjectId,
  modifiedOn: string
}

export type FolderResponse = {
  id: string,
  name: string,
  type: "personal" | "shared",
  createdBy: {
    id: string,
    name: string,
    email: string
  },
  createdOn: string,
  modifiedBy: {
    id: string,
    name: string,
    email: string
  },
  modifiedOn: string
}

export type SessionModel = {
  user: ObjectId,
  createdOn: string
}

export type SessionResponse = {
  id: string,
  user: {
    id: string,
    name: string,
    email: string
  },
  createdOn: string
}

export type MemberModel = {
  folder: ObjectId,
  user: ObjectId
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
  folder: FolderResponse,
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

