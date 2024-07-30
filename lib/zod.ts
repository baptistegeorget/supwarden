import { boolean, object, string } from "zod"

export const signInSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
})

export const signUpSchema = object({
  firstName: string({ required_error: "First name is required" })
    .min(1, "First name is required")
    .max(32, "First name must be less than 32 characters"),
  lastName: string({ required_error: "Last name is required" })
    .min(1, "Last name is required")
    .max(32, "Last name must be less than 32 characters"),
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
})

export const folderSchema = object({
  name: string({ required_error: "Name is required" })
    .min(1, "Name is required")
    .max(32, "Name must be less than 32 characters"),
})

export const invitationSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  folderId: string({ required_error: "Folder ID is required" })
    .min(1, "Folder ID is required"),
})

export const invitationResponseSchema = object({
  invitationId: string({ required_error: "Invitation ID is required" })
    .min(1, "Invitation ID is required"),
  isAccepted: boolean({ required_error: "Response is required" }),
})