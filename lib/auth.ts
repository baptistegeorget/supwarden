import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "@/lib/mongodb"
import { signInSchema } from "@/lib/zod"
import { hashPassword } from "@/utils/password"
import { getUserWithCredentials } from "@/utils/db"
import { ZodError } from "zod"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GitHub,
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          const { email, password } = await signInSchema.parseAsync(credentials)

          const pwHash = hashPassword(password)

          let user = await getUserWithCredentials(email, pwHash)

          if (!user) {
            throw new Error("User not found.")
          }

          return user
        } catch (error) {
          if (error instanceof ZodError) {
            const errors = error.errors.map(err => ({ path: err.path, message: err.message }))
            throw new Error(JSON.stringify(errors))
          } else {
            throw new Error(error instanceof Error ? error.message : 'Unknown error')
          }
        }
      },
    })
  ],
  pages: {
    signIn: "/signin"
  }
})