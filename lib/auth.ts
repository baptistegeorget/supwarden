import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "@/lib/mongodb"
import { signInSchema } from "@/lib/zod"
import { hashPassword } from "@/utils/password"
import { getUserWithCredentials } from "@/utils/db"

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

          return user
        } catch (error) {
          return null
        }
      },
    })
  ],
  pages: {
    signIn: "/signin"
  }
})