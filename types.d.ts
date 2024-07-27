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
  members?: string[],
  createdBy: string,
  createdOn: string,
  modifiedBy: string,
  modifiedOn: string,
}

export type Element = {
  folder: string,
  name: string,
  identifier?: string,
  password?: string,
  urls?: string[],
  note?: string,
  customFields?: CustomField[],
  usersWhoCanEdit?: string[],
  isSensitive?: boolean,
  createdBy: string,
  createdOn: string,
  modifiedBy: string,
  modifiedOn: string,
}

type CustomField = {
  type: "visible" | "hidden" | "attachment",
  value: string,
}