"use client"

import { SessionResponse, FolderResponse, ElementResponse } from "@/types"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getSession } from "@/lib/auth"
import Header from "@/components/Header"
import MembersPanel from "@/components/MembersPanel"
import ElementFormPanel from "@/components/ElementFormPanel"
import FoldersPanel from "@/components/FoldersPanel"
import { createPortal } from "react-dom"
import { useNotification } from "@/components/NotificationProvider"
import MessagesPanel from "@/components/MessagesPanel"

export default function HomePage() {
  const notify = useNotification()
  const router = useRouter()
  const [session, setSession] = useState<SessionResponse | null>(null)
  const [selectedFolder, setSelectedFolder] = useState<FolderResponse | null>(null)
  const [elements, setElements] = useState<ElementResponse[]>([])
  const [selectedElement, setSelectedElement] = useState<ElementResponse | null>(null)
  const [rightPanelView, setRightPanelView] = useState<"members" | "element-form" | "messages">("members")
  const [isSendInvitationPopupVisible, setIsSendInvitationPopupVisible] = useState(false)

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

  useEffect(() => {
    if (session && selectedFolder) {
      fetchElements(session.user.id, selectedFolder.id)
    }
  }, [session, selectedFolder])

  async function fetchElements(userId: string, folderId: string, query?: string) {
    const response = await fetch(`/api/users/${userId}/folders/${folderId}/elements${query ? `?query=${query}` : ""}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })

    if (response.ok) {
      const { elements }: { elements: ElementResponse[] } = await response.json()
      setElements(elements)
    } else {
      setElements([])
    }
  }

  async function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)
    const body = Object.fromEntries(formData.entries())

    if (!session || !selectedFolder) return

    const response = await fetch(`/api/users/${session.user.id}/folders/${selectedFolder.id}/send-invitation`, {
      method: "POST",
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
  }

  if (!session) return null

  return (
    <>
      <Header session={session} />
      <div className="flex-1 flex min-h-0">
        <FoldersPanel
          session={session}
          selectedFolder={selectedFolder || undefined}
          onSelect={(folder) => {
            setSelectedFolder(folder)
            setSelectedElement(null)
            setRightPanelView(folder.type === "shared" ? "members" : "element-form")
          }}
        />
        {selectedFolder && (
          <main className="flex-1 p-8 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">{selectedFolder.name}</h2>
              <div className="flex gap-2">
                <input
                  type="search"
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      fetchElements(session.user.id, selectedFolder.id, event.currentTarget.value)
                      setSelectedElement(null)
                    }
                  }}
                  placeholder="Search an element..."
                  className="px-2 py-1 rounded bg-transparent border border-neutral-700 w-48"
                />
                {selectedFolder.type === "shared" && (
                  <button onClick={() => setIsSendInvitationPopupVisible(true)}>
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.5 12a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11ZM4 12.999l8.81.001A6.478 6.478 0 0 0 11 17.5c0 1.087.267 2.112.739 3.013-1.05.35-2.208.487-3.239.487-2.722 0-6.335-.956-6.495-4.27L2 16.5v-1.501a2 2 0 0 1 2-2Zm13.5 1.003-.09.008a.5.5 0 0 0-.402.402l-.008.09V17h-2.5l-.09.008a.5.5 0 0 0-.402.402L14 17.5l.008.09a.5.5 0 0 0 .402.402l.09.008H17v2.5l.008.09a.5.5 0 0 0 .402.402l.09.008.09-.008a.5.5 0 0 0 .402-.402L18 20.5V18h2.5l.09-.008a.5.5 0 0 0 .402-.402L21 17.5l-.008-.09a.5.5 0 0 0-.402-.402L20.5 17H18v-2.498l-.008-.09a.5.5 0 0 0-.402-.402l-.09-.008ZM8.5 2a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Zm9 2a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Z" fill="#ffffff" /></svg>
                  </button>
                )}
                {selectedFolder.type === "shared" && (
                  <button
                    onClick={() => {
                      setSelectedElement(null)
                      setRightPanelView("members")
                    }}
                  >
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m3.5 14 10 .001a1.5 1.5 0 0 1 1.493 1.356L15 15.5V17.5C14.999 21 11.284 22 8.5 22c-2.722 0-6.335-.956-6.495-4.27L2 17.5v-2a1.5 1.5 0 0 1 1.356-1.493L3.5 14Zm11.988 0H20.5a1.5 1.5 0 0 1 1.493 1.355L22 15.5V17c-.001 3.062-2.858 4-5 4a7.16 7.16 0 0 1-2.14-.322c.653-.75 1.076-1.703 1.133-2.898L16 17.5v-2c0-.494-.15-.951-.399-1.338L15.488 14H20.5h-5.012ZM8.5 3a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Zm9 2a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Z" fill="#ffffff" /></svg>
                  </button>
                )}
                {selectedFolder.type === "shared" && (
                  <button
                    onClick={() => {
                      setSelectedElement(null)
                      setRightPanelView("messages")
                    }}
                  >
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10a9.96 9.96 0 0 1-4.644-1.142l-4.29 1.117a.85.85 0 0 1-1.037-1.036l1.116-4.289A9.959 9.959 0 0 1 2 12C2 6.477 6.477 2 12 2Zm1.252 11H8.75l-.102.007a.75.75 0 0 0 0 1.486l.102.007h4.502l.101-.007a.75.75 0 0 0 0-1.486L13.252 13Zm1.998-3.5h-6.5l-.102.007a.75.75 0 0 0 0 1.486L8.75 11h6.5l.102-.007a.75.75 0 0 0 0-1.486L15.25 9.5Z" fill="#ffffff" /></svg>
                  </button>
                )}
                <button
                  onClick={() => {
                    setSelectedElement(null)
                    setRightPanelView("element-form")
                  }}
                >
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11.883 3.007 12 3a1 1 0 0 1 .993.883L13 4v7h7a1 1 0 0 1 .993.883L21 12a1 1 0 0 1-.883.993L20 13h-7v7a1 1 0 0 1-.883.993L12 21a1 1 0 0 1-.993-.883L11 20v-7H4a1 1 0 0 1-.993-.883L3 12a1 1 0 0 1 .883-.993L4 11h7V4a1 1 0 0 1 .883-.993L12 3l-.117.007Z" fill="#ffffff" /></svg>
                </button>
              </div>
            </div>
            <div className="flex flex-col h-full overflow-auto scrollbar-thin">
              {elements.map((element, index) => (
                <>
                  <button
                    key={index}
                    onClick={() => {
                      setRightPanelView("element-form")
                      setSelectedElement(element)
                    }}
                    className={`px-2 py-1 rounded flex gap-2 justify-between items-center ${selectedElement?.id === element.id && "bg-white text-black"}`}
                  >
                    <div className="flex gap-2 items-center">
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M8.95 8.6a6.554 6.554 0 0 1 6.55-6.55c3.596 0 6.55 2.819 6.55 6.45a6.554 6.554 0 0 1-6.55 6.55c-.531 0-1.055-.076-1.552-.204A1.25 1.25 0 0 1 12.7 16.05h-1.75v1.75c0 .69-.56 1.25-1.25 1.25H7.95v1.25a1.75 1.75 0 0 1-1.75 1.75H3.7a1.75 1.75 0 0 1-1.75-1.75v-2.172c0-.73.29-1.429.806-1.944L8.99 9.948a.275.275 0 0 0 .07-.244A6.386 6.386 0 0 1 8.95 8.6Zm9.3-1.6a1.25 1.25 0 1 0-2.5 0 1.25 1.25 0 0 0 2.5 0Z" fill={selectedElement?.id === element.id ? "#000000" : "#ffffff"} /></svg>
                      {element.name}
                    </div>
                    <div className="flex gap-2 items-center">
                      {element.isSensitive && (
                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2a4 4 0 0 1 4 4v2h2.5A1.5 1.5 0 0 1 20 9.5v11a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 20.5v-11A1.5 1.5 0 0 1 5.5 8H8V6a4 4 0 0 1 4-4Zm0 11.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3ZM12 4a2 2 0 0 0-2 2v2h4V6a2 2 0 0 0-2-2Z" fill="#404040" /></svg>
                      )}
                      {(element.idsOfMembersWhoCanEdit.includes(session.user.id) || element.createdBy.id === session.user.id || selectedFolder.createdBy.id === session.user.id) && (
                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M13.94 5 19 10.06 9.062 20a2.25 2.25 0 0 1-.999.58l-5.116 1.395a.75.75 0 0 1-.92-.921l1.395-5.116a2.25 2.25 0 0 1 .58-.999L13.938 5Zm7.09-2.03a3.578 3.578 0 0 1 0 5.06l-.97.97L15 3.94l.97-.97a3.578 3.578 0 0 1 5.06 0Z" fill="#404040" /></svg>
                      )}
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 9.005a4 4 0 1 1 0 8 4 4 0 0 1 0-8ZM12 5.5c4.613 0 8.596 3.15 9.701 7.564a.75.75 0 1 1-1.455.365 8.503 8.503 0 0 0-16.493.004.75.75 0 0 1-1.455-.363A10.003 10.003 0 0 1 12 5.5Z" fill="#404040" /></svg>
                    </div>
                  </button>
                  {index < elements.length - 1 && (
                    <hr className="border-neutral-700" />
                  )}
                </>
              ))}
            </div>
          </main>
        )}
        {selectedFolder && rightPanelView === "members" && (
          <MembersPanel
            session={session}
            folder={selectedFolder}
          />
        )}
        {selectedFolder && rightPanelView === "element-form" && (
          <ElementFormPanel
            session={session}
            folder={selectedFolder}
            element={selectedElement || undefined}
            onSuccess={async (element) => {
              await fetchElements(session.user.id, selectedFolder.id)
              setSelectedElement(element)
            }}
            onDelete={() => {
              setSelectedElement(null)
              fetchElements(session.user.id, selectedFolder.id)
            }}
          />
        )}
        {selectedFolder && rightPanelView === "messages" && (
          <MessagesPanel
            session={session}
            folder={selectedFolder}
          />
        )}
      </div>
      {isSendInvitationPopupVisible && createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-black p-8 rounded border border-neutral-700 flex flex-col gap-2 items-center w-96 justify-between">
            <h2 className="text-xl font-bold">Send invitation</h2>
            <form onSubmit={submitForm} className="flex gap-2 items-center w-full">
              <input type="email" name="email" placeholder="Enter the user email..." className="px-2 py-1 rounded bg-transparent border border-neutral-700 w-full" required />
              <button type="submit" className="px-2 py-1 rounded bg-white text-black">Send</button>
            </form>
            <button onClick={() => setIsSendInvitationPopupVisible(false)} className="px-2 py-1 rounded bg-transparent border border-neutral-700 text-white">Close</button>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}