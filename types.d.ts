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
 * Type User for the API response
 */
export type UserResponse = {
  id: string,
  lastName: string,
  firstName: string,
  email: string,
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
 * Type Folder for the API response
 */
export type FolderResponse = {
  id: string,
  name: string,
  type: "personal" | "shared",
  members: UserResponse[],
  creator: UserResponse,
  createdOn: string,
  modifier: UserResponse,
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
 * Type Invitation for the API response
 */
export type InvitationResponse = {
  id: string,
  folder: { id: string, name: string },
  user: UserResponse,
  status: "pending" | "accepted" | "rejected",
  creator: UserResponse,
  createdOn: string,
  modifier: UserResponse,
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
  urls?: string[],
  note?: string,
  customFields?: { type: "visible" | "hidden" | "attachment", value: string }[],
  idsOfMembersWhoCanEdit?: string[],
  isSensitive?: boolean,
  creatorId: ObjectId,
  createdOn: string,
  modifierId: ObjectId,
  modifiedOn: string,
}

/**
 * Type Element for the API response
 */
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
  modifiedOn: string,
}

/**
 * Type Session for the database
 */
export type SessionModel = {
  userId: ObjectId,
  date: string,
}

/**
 * Type Session for the API response
 */
export type SessionResponse = {
  user: UserResponse,
  date: string,
}