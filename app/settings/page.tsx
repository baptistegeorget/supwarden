import Header from "@/components/header";
import { auth } from "@/lib/auth";

export default async function SettingsPage() {
  const session = await auth()

  return (
    <>
      {session && <Header session={session} />}
    </>
  )
}