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
  type: "private" | "shared",
  createdBy: ObjectId,
  createdOn: string,
  modifiedBy: ObjectId,
  modifiedOn: string
}

export type FolderResponse = {
  id: string,
  name: string,
  type: "private" | "shared",
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
  folder: ObjectId,
  user: ObjectId,
  status: "pending" | "accepted" | "rejected",
  createdBy: ObjectId,
  createdOn: string,
  modifiedBy: ObjectId,
  modifiedOn: string
}

export type InvitationResponse = {
  id: string,
  folder: {
    id: string,
    name: string
  },
  user: {
    id: string,
    name: string,
    email: string
  },
  status: "pending" | "accepted" | "rejected",
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

export type ElementModel = {
  folder: ObjectId,
  name: string,
  identifier?: string,
  password?: string,
  urls?: string[],
  note?: string,
  customFields?: {
    type: "visible" | "hidden" | "attachment",
    value: string | {
      name: string,
      data: string
    }
  }[],
  idsOfMembersWhoCanEdit?: string[],
  isSensitive?: boolean,
  createdBy: ObjectId,
  createdOn: string,
  modifiedBy: ObjectId,
  modifiedOn: string
}

export type ElementResponse = {
  id: string,
  folder: {
    id: string,
    name: string
  },
  name: string,
  identifier?: string,
  password?: string,
  urls?: string[],
  note?: string,
  customFields?: {
    type: "visible" | "hidden" | "attachment",
    value: string | {
      name: string,
      data: string
    }
  }[],
  idsOfMembersWhoCanEdit?: string[],
  isSensitive?: boolean,
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