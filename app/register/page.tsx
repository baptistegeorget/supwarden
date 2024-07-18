import RegistrationForm from "@/components/registration-form"
import Link from "next/link"

export default async function Register() {
  return (
    <main className="flex-1 flex flex-col justify-center items-center">
      <div className="rounded-md shadow-lg py-8 px-16 flex flex-col gap-4 border border-neutral-700">
        <h1 className="text-center text-2xl">SUPWARDEN</h1>
        <RegistrationForm />
        <Link href="/login" className="text-center text-blue-600">I have an account</Link>
      </div>
    </main>
  )
}