import { object, string } from "zod";

const emailSchema = string({ required_error: "Email is required" })
  .min(1, "Email is required")
  .email("Invalid email")

const passwordSchema = string({ required_error: "Password is required" })
  .min(1, "Password is required")
  .min(8, "Password must be more than 8 characters")
  .max(32, "Password must be less than 32 characters")

const nameSchema = (fieldName: string) => string({ required_error: `${fieldName} is required` })
  .min(1, `${fieldName} is required`)
  .max(32, `${fieldName} must be less than 32 characters`)
  .regex(/^[a-zA-ZÀ-ÿ\s-]+$/, `${fieldName} must contain only letters and spaces`)

export const signInSchema = object({
  email: emailSchema,
  password: passwordSchema,
})

export const signUpSchema = object({
  firstName: nameSchema("First name"),
  lastName: nameSchema("Last name"),
  email: emailSchema,
  password: passwordSchema,
  passwordConfirmation: string({ required_error: "Password confirmation is required" })
    .min(1, "Password confirmation is required")
})
.refine(data => data.password === data.passwordConfirmation, {
  message: "Passwords don't match",
  path: ["passwordConfirmation"],
})
