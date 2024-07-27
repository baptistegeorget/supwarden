import { createHash } from "crypto"

export function hashPassword(password: string) {
  const hashedPassword = createHash("sha256").update(password).digest("hex")
  return hashedPassword
}