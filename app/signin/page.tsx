import Link from "next/link"
import { SignInForm } from "@/components/forms"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function SignInPage() {
  const session = await auth()

  if (session) {
    redirect("/")
  }

  return (
    <main className="flex-1 flex flex-col justify-center items-center">
      <div className="rounded-md shadow-lg py-8 px-16 flex flex-col gap-4 border border-neutral-700">
        <h1 className="text-center text-2xl">SUPWARDEN</h1>
        <SignInForm />
        <Link href="/signup" className="text-center text-blue-600">I don&apos;t have an account</Link>
        <Link href="/forgot-password" className="text-center text-blue-600">I forgot my password</Link>
      </div>
    </main>
  )
}