import jwt from "jsonwebtoken"

if (!process.env.JWT_SECRET) {
  throw new Error('Invalid/Missing environment variable: "JWT_SECRET"')
}

const jwtSecret = process.env.JWT_SECRET

export function verify<T>(token: string) {
  try {
    const payload = jwt.verify(token, jwtSecret) as T
    return payload
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error("Token expired")
    }
    throw new Error("Invalid token")
  }
}