import zod from "zod"

const emailSchema = zod.string().email()
const passwordSchema = zod.string().min(8).max(32)
const shortStringSchema = zod.string().min(1).max(32)
const longStringSchema = zod.string().min(1).max(512)
const base64Schema = zod.string().regex(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).base64,/)
const objectIdSchema = zod.string().regex(/^[a-fA-F0-9]{24}$/)
const urlSchema = zod.string().url()

export const signInSchema = zod.object({
  email: emailSchema,
  password: passwordSchema,
})

export const signUpSchema = zod.object({
  firstName: shortStringSchema,
  lastName: shortStringSchema,
  email: emailSchema,
  password: passwordSchema,
})

export const folderSchema = zod.object({
  name: shortStringSchema,
})

export const invitationSchema = zod.object({
  email: emailSchema,
  folderId: objectIdSchema,
})

const customFieldSchema = zod.object({ 
  type: zod.enum(["visible", "hidden", "attachment"]),
  value: zod.union([shortStringSchema, base64Schema]),
})

export const elementSchema = zod.object({
  name: shortStringSchema,
  identifier: shortStringSchema.optional(),
  password: passwordSchema.optional(),
  urls: zod.array(urlSchema).optional(),
  note: longStringSchema.optional(),
  customFields: zod.array(customFieldSchema).optional(),
  idsOfMembersWhoCanEdit: zod.array(objectIdSchema).optional(),
  isSensitive: zod.boolean().optional(),
})