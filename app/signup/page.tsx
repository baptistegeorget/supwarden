import Link from "next/link"
import SignUpForm from "@/components/forms/sign-up"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function SignUpPage() {
  const session = await auth()

  if (session) {
    redirect("/")
  }

  return (
    <div className="flex-1 flex flex-col justify-center items-center">
      <main className="rounded-md shadow-lg py-8 px-16 flex flex-col gap-4 border border-neutral-700">
        <h1 className="text-center text-2xl font-bold">SUPWARDEN</h1>
        <SignUpForm />
        <Link href="/signin" className="text-center text-blue-600">I have an account</Link>
      </main>
    </div>
  )
}