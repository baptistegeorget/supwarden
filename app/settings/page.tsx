"use client"

import Header from "@/components/Header"
import { useNotification } from "@/components/NotificationProvider"
import { getSession } from "@/lib/auth"
import { SessionResponse } from "@/types"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function SettingsPage() {
  const notify = useNotification()
  const router = useRouter()
  const [session, setSession] = useState<SessionResponse | null>(null)
  const [panel, setPanel] = useState<"account" | "import/export">("account")
  const [pin, setPin] = useState<string[]>(Array(6).fill(""))

  useEffect(() => {
    getSession()
      .then((session) => {
        if (session) {
          setSession(session)
        } else {
          router.push("/signin")
        }
      })
  }, [router])

  if (!session) return null

  return (
    <>
      <Header session={session} />
      <div className="flex-1 flex min-h-0">
        <aside className="flex flex-col gap-4 p-8 border-r border-neutral-700 w-96">
          <button
            onClick={() => router.push("/")}
            className="flex gap-2 items-center"
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M10.295 19.716a1 1 0 0 0 1.404-1.425l-5.37-5.29h13.67a1 1 0 1 0 0-2H6.336L11.7 5.714a1 1 0 0 0-1.404-1.424l-6.924 6.822a1.25 1.25 0 0 0 0 1.78l6.924 6.823Z" fill="#ffffff" /></svg>
            <p>Back to home</p>
          </button>
          <div className="flex flex-col gap-1">
            <button
              onClick={() => setPanel("account")}
              className={`px-2 py-1 rounded flex gap-2 items-center ${panel === "account" ? "bg-white text-black" : "bg-black text-white"}`}
            >
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.754 14a2.249 2.249 0 0 1 2.25 2.249v.918a2.75 2.75 0 0 1-.513 1.599C17.945 20.929 15.42 22 12 22c-3.422 0-5.945-1.072-7.487-3.237a2.75 2.75 0 0 1-.51-1.595v-.92a2.249 2.249 0 0 1 2.249-2.25h11.501ZM12 2.004a5 5 0 1 1 0 10 5 5 0 0 1 0-10Z" fill={panel === "account" ? "#000000" : "#ffffff"} /></svg>
              <p>Account</p>
            </button>
            <button
              onClick={() => setPanel("import/export")}
              className={`px-2 py-1 rounded flex gap-2 items-center ${panel === "import/export" ? "bg-white text-black" : "bg-black text-white"}`}
            >
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m6.288 4.293-3.995 4-.084.095a1 1 0 0 0 .084 1.32l.095.083a1 1 0 0 0 1.32-.084L6 7.41V19l.007.117a1 1 0 0 0 .993.884l.117-.007A1 1 0 0 0 8 19V7.417l2.293 2.29.095.084a1 1 0 0 0 1.319-1.499l-4.006-4-.094-.083a1 1 0 0 0-1.32.084ZM17 4.003l-.117.007a1 1 0 0 0-.883.993v11.58l-2.293-2.29-.095-.084a1 1 0 0 0-1.319 1.498l4.004 4 .094.084a1 1 0 0 0 1.32-.084l3.996-4 .084-.095a1 1 0 0 0-.084-1.32l-.095-.083a1 1 0 0 0-1.32.084L18 16.587V5.003l-.007-.116A1 1 0 0 0 17 4.003Z" fill={panel === "import/export" ? "#000000" : "#ffffff"} /></svg>
              <p>Import / Export</p>
            </button>
          </div>
        </aside>
        {panel === "account" && (
          <main className="flex-1 flex flex-col gap-4 p-8">
            <h2 className="text-xl font-bold w-96">Change password</h2>
            <form
              onSubmit={async (event) => {
                event.preventDefault()

                const form = event.currentTarget
                const formData = new FormData(form)
                const body = Object.fromEntries(formData.entries())

                const response = await fetch(`/api/users/${session.user.id}/change-password`, {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify(body)
                })

                if (response.ok) {
                  const { message }: { message: string } = await response.json()
                  notify(message, "success")
                  form.reset()
                } else {
                  const { error }: { error: string } = await response.json()
                  notify(error, "error")
                }
              }}
              className="flex flex-col gap-2 w-96 items-center"
            >
              <div className="flex flex-col gap-1">
                <label htmlFor="currentPassword">Current password</label>
                <input
                  id="currentPassword"
                  type="password"
                  name="currentPassword"
                  placeholder="Current password..."
                  className="px-2 py-1 rounded border border-neutral-700 bg-transparent w-96"
                  required
                  minLength={8}
                  maxLength={32}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="newPassword">New password</label>
                <input
                  id="newPassword"
                  type="password"
                  name="newPassword"
                  placeholder="New password..."
                  className="px-2 py-1 rounded border border-neutral-700 bg-transparent w-96"
                  required
                  minLength={8}
                  maxLength={32}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="passwordConfirmation">Password confirmation</label>
                <input
                  id="passwordConfirmation"
                  type="password"
                  name="passwordConfirmation"
                  placeholder="Confirm password..."
                  className="px-2 py-1 rounded border border-neutral-700 bg-transparent w-96"
                  required
                  minLength={8}
                  maxLength={32}
                />
              </div>
              <button type="submit" className="px-2 py-1 rounded bg-white text-black">Save</button>
            </form>
            <h2 className="text-xl font-bold">Change PIN</h2>
            <div className="flex gap-2 items-center">
              <form
                onSubmit={async (event) => {
                  event.preventDefault()

                  const response = await fetch(`/api/users/${session.user.id}/change-pin`, {
                    method: "PATCH",
                    headers: {
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ pin: pin.join("") })
                  })

                  if (response.ok) {
                    const { message }: { message: string } = await response.json()
                    notify(message, "success")
                    setPin(Array(6).fill(""))
                    getSession()
                      .then((session) => {
                        if (session) {
                          setSession(session)
                        } else {
                          router.push("/signin")
                        }
                      })
                  } else {
                    const { error }: { error: string } = await response.json()
                    notify(error, "error")
                  }
                }}
                className="flex gap-2"
              >
                <div className="flex gap-2">
                  {pin.map((_, index) => (
                    <input
                      key={index}
                      id={`pin-input-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={pin[index]}
                      onChange={async (event) => {
                        const pinCopy = [...pin]
                        pinCopy[index] = event.target.value
                        setPin(pinCopy)

                        if (event.target.value && index < pin.length - 1) {
                          document.getElementById(`pin-input-${index + 1}`)?.focus()
                        }

                        if (!event.target.value && index > 0) {
                          document.getElementById(`pin-input-${index - 1}`)?.focus()
                        }
                      }}
                      className="px-2 py-1 rounded bg-transparent border border-neutral-700 w-8 text-center"
                    />
                  ))}
                </div>
                <button type="submit" className="px-2 py-1 rounded bg-white text-black">Save</button>
              </form>
              {session.user.hasPin && (
                <button
                  type="button"
                  className="px-2 py-1 rounded bg-red-700 text-white"
                  onClick={async () => {
                    const response = await fetch(`/api/users/${session.user.id}/delete-pin`, {
                      method: "PATCH",
                      headers: {
                        "Content-Type": "application/json"
                      }
                    })

                    if (response.ok) {
                      const { message }: { message: string } = await response.json()
                      notify(message, "success")
                      getSession()
                        .then((session) => {
                          if (session) {
                            setSession(session)
                          } else {
                            router.push("/signin")
                          }
                        })
                    } else {
                      const { error }: { error: string } = await response.json()
                      notify(error, "error")
                    }
                  }}
                >
                  Delete PIN
                </button>
              )}
              {!session.user.hasPin && (
                <p className="text-neutral-700">You don&apos;t have a PIN</p>
              )}
            </div>
          </main>
        )}
      </div>
    </>
  )
}