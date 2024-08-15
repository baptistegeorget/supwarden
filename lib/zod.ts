import { z } from "zod"

export const signUpSchema = z.object({
  firstName: z.string().min(1).max(32),
  lastName: z.string().min(1).max(32),
  email: z.string().email(),
  password: z.string().min(8).max(32),
  passwordConfirmation: z.string().min(8).max(32)
})

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(32)
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