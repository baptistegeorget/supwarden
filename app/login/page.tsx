import GithubLoginButton from "@/components/github-login-button"
import LoginForm from "@/components/login-form"
import Link from "next/link"

export default async function Login() {
  return (
    <main className="flex-1 flex flex-col justify-center items-center">
      <div className="rounded-md shadow-lg py-8 px-16 flex flex-col gap-4 border border-neutral-700">
        <h1 className="text-center text-2xl">SUPWARDEN</h1>
        <LoginForm />
        <p className="text-center">Or</p>
        <GithubLoginButton />
        <Link href="/register" className="text-center text-blue-600">I don&apos;t have an account</Link>
        <Link href="/forgot-password" className="text-center text-blue-600">I forgot my password</Link>
      </div>
    </main>
  )
}