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
  name: z.string({ required_error: "The name is required" })
    .min(1, "The length of the name must be greater than or equal to 1")
    .max(32, "The length of the name must be less than or equal to 32"),
})

export const invitationSchema = z.object({
  email: z.string({ required_error: "The email is required" })
    .email("The email must be a valid email address"),
})

export const invitationResponseSchema = z.object({
  isAccepted: z.boolean({ required_error: "The acceptance is required" })
})

const fileSchema = z.object({
  name: z.string({ required_error: "The name is required" }),
  data: z.string({ required_error: "The data is required" })
    .regex(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).base64/, "The data must be a base64 encoded string")
})

const customFieldSchema = z.object({
  type: z.enum(["visible", "hidden", "attachment"], { required_error: "The type is required" }),
  value: z.union([
    z.string({ required_error: "The value is required" })
      .min(1, "The length of the value must be greater than or equal to 1")
      .max(32, "The length of the value must be less than or equal to 32"),
    fileSchema
  ])
}).refine((data) => {
  if (data.type === "attachment") {
    return fileSchema.safeParse(data.value).success
  }
  return z.string().safeParse(data.value).success
})

export const elementSchema = z.object({
  name: z.string({ required_error: "The name is required" })
    .min(1, "The length of the name must be greater than or equal to 1")
    .max(32, "The length of the name must be less than or equal to 32"),
  identifier: z.string({ required_error: "The identifier is required" })
    .max(32, "The length of the identifier must be less than or equal to 32"),
  password: z.string({ required_error: "The password is required" })
    .max(32, "The length of the password must be less than or equal to 32"),
  urls: z.array(z.string({ required_error: "The URL is required" }).url(), { required_error: "The URLs are required" }),
  note: z.string({ required_error: "The note is required" })
    .max(512, "The length of the note must be less than or equal to 512"),
  customFields: z.array(customFieldSchema, { required_error: "The custom fields are required" }),
  idsOfMembersWhoCanEdit: z.array(z.string({ required_error: "The ID is required" }).regex(/^[a-fA-F0-9]{24}$/), { required_error: "The IDs of the members who can edit are required" }),
  isSensitive: z.boolean({ required_error: "The sensitivity is required" })
})

export const checkPasswordSchema = z.object({
  password: z.string({ required_error: "The password is required" })
    .min(8, "The length of the password must be greater than or equal to 8")
    .max(32, "The length of the password must be less than or equal to 32")
    .optional(),
  pin: z.string({ required_error: "The PIN is required" })
    .length(6, "The length of the PIN must be equal to 6")
    .regex(/^[0-9]{6}$/, "The PIN must be a 6-digit number")
    .optional()
})