import { ObjectId } from "mongodb"

export type User = {
  lastName: string,
  firstName: string,
  email: string,
  password: string,
  pin?: string,
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
  customFields?: CustomField[],
  usersWhoCanEdit?: ObjectId[],
  isSensitive?: boolean,
  createdBy: ObjectId,
  createdOn: string,
  modifiedBy: ObjectId,
  modifiedOn: string,
}

type CustomField = {
  type: "visible" | "hidden" | "attachment",
  value: string,
}