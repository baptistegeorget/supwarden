import { ObjectId } from "mongodb"

export type User = {
  lastName: string,
  firstName: string,
  email: string,
  password: string,
  pin?: string,
  createdOn: string,
  modifiedOn: string,
}

export type Folder = {
  name: string,
  type: "personal" | "shared",
  members?: ObjectId[],
  createdBy: ObjectId,
  createdOn: string,
  modifiedBy: ObjectId,
  modifiedOn: string,
}

export type Element = {
  folder: ObjectId,
  name: string,
  identifier?: string,
  password?: string,
  urls?: string[],
  note?: string,
  customFields?: { type: "visible" | "hidden" | "attachment", value: string }[],
  usersWhoCanEdit?: ObjectId[],
  isSensitive?: boolean,
  createdBy: ObjectId,
  createdOn: string,
  modifiedBy: ObjectId,
  modifiedOn: string,
}

export type Invitation = {
  folder: ObjectId,
  user: ObjectId,
  state: "pending" | "accepted" | "rejected",
  createdBy: ObjectId,
  createdOn: string,
  modifiedBy: ObjectId,
  modifiedOn: string,
}

export type Session = {
  user: {
    id: string,
    email: string,
    name: string,
  }
}