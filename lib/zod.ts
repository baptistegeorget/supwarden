import zod from "zod"

export const signUpSchema = zod.object({
  firstName: zod.string().min(1).max(32),
  lastName: zod.string().min(1).max(32),
  email: zod.string().email(),
  password: zod.string().min(8).max(32),
  passwordConfirmation: zod.string().min(8).max(32)
})

export const signInSchema = zod.object({
  email: zod.string().email(),
  password: zod.string().min(8).max(32)
})

export const folderSchema = zod.object({
  name: zod.string().min(1).max(32)
})

export const invitationSchema = zod.object({
  email: zod.string().email()
})

const customFieldSchema = zod.object({
  type: zod.enum(["visible", "hidden", "attachment"]),
  value: zod.union([
    zod.string().min(1).max(32),
    zod.string().regex(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).base64,/)
  ])
}).refine((data) => {
  if (data.type === "attachment") {
    return zod.string().regex(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).base64,/).safeParse(data.value).success;
  } else {
    return zod.string().min(1).max(32).safeParse(data.value).success;
  }
})

export const elementSchema = zod.object({
  name: zod.string().min(1).max(32),
  identifier: zod.string().max(32).optional(),
  password: zod.string().max(32).optional(),
  urls: zod.array(zod.string().url()).optional(),
  note: zod.string().max(512).optional(),
  customFields: zod.array(customFieldSchema).optional(),
  idsOfMembersWhoCanEdit: zod.array(zod.string().regex(/^[a-fA-F0-9]{24}$/)).optional(),
  isSensitive: zod.boolean().optional()
})