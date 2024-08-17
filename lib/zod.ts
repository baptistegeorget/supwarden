import { z } from "zod"

export const signUpSchema = z.object({
  name: z.string({ required_error: "The name is required" })
    .min(1, "The length of the name must be greater than or equal to 1")
    .max(32, "The length of the name must be less than or equal to 32"),
  email: z.string({ required_error: "The email is required" })
    .email("The email must be a valid email address"),
  password: z.string({ required_error: "The password is required" })
    .min(8, "The length of the password must be greater than or equal to 8")
    .max(32, "The length of the password must be less than or equal to 32"),
  passwordConfirmation: z.string({ required_error: "The password confirmation is required" })
    .min(8, "The length of the password confirmation must be greater than or equal to 8")
    .max(32, "The length of the password confirmation must be less than or equal to 32")
}).refine((data) => {
  return data.password === data.passwordConfirmation
}, { message: "The passwords do not match" })

export const signInSchema = z.object({
  email: z.string({ required_error: "The email is required" })
    .email("The email must be a valid email address"),
  password: z.string({ required_error: "The password is required" })
    .min(8, "The length of the password must be greater than or equal to 8")
    .max(32, "The length of the password must be less than or equal to 32")
})

export const folderSchema = z.object({
  name: z.string().min(1).max(32)
})

export const invitationSchema = z.object({
  email: z.string().email()
})

const fileSchema = z.object({
  name: z.string().min(1).max(256),
  data: z.string().regex(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).base64/)
})

const customFieldSchema = z.object({
  type: z.enum(["visible", "hidden", "attachment"]),
  value: z.union([
    z.string().min(1).max(32),
    fileSchema
  ])
}).refine((data) => {
  if (data.type === "attachment") {
    return fileSchema.safeParse(data.value).success;
  }
  return z.string().safeParse(data.value).success;
})

export const elementSchema = z.object({
  name: z.string().min(1).max(32),
  identifier: z.string().max(32).optional(),
  password: z.string().max(32).optional(),
  urls: z.array(z.string().url()).optional(),
  note: z.string().max(512).optional(),
  customFields: z.array(customFieldSchema).optional(),
  idsOfMembersWhoCanEdit: z.array(z.string().regex(/^[a-fA-F0-9]{24}$/)).optional(),
  isSensitive: z.boolean().optional()
})