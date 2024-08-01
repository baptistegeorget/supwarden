"use client"

import PrimaryButton from "@/components/buttons/primary"
import ElementForm from "@/components/forms/element"
import FolderForm from "@/components/forms/folder"
import { Header } from "@/components/header"
import { FoldersList } from "@/components/lists"
import { SendInvitationsPopup } from "@/components/popups"
import { auth, getAuthToken } from "@/lib/auth"
import { Folder, Element, Session } from "@/types"
import { WithId } from "mongodb"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()
  const [session, setSession] = useState<Session | null>(null)
  const [folders, setFolders] = useState<WithId<Folder>[]>([])
  const [selectedFolder, setSelectedFolder] = useState<WithId<Folder> | null>(null)
  const [elements, setElements] = useState<WithId<Element>[]>([])
  const [selectedElement, setSelectedElement] = useState<WithId<Element> | null>(null)
  const [isSendInvitationsPopupVisible, setIsSendInvitationsPopupVisible] = useState(false)

  useEffect(() => {
    getSession()
    getFolders()
  }, [])

  async function getSession() {
    const session = await auth()
    setSession(session)
  }

  async function getFolders() {
    const authToken = await getAuthToken()

    if (!authToken) {
      return
    }

    const response = await fetch("/api/folders", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken,
      },
    })

    if (response.ok) {
      const result = await response.json()
      return setFolders(result.folders)
    } else {
      return setFolders([])
    }
  }

  async function getElements() {

  }

  if (!session) {
    return null
  }

  return (
    <>
      <Header session={session} />
      <div className="flex flex-1">
        <aside className="w-1/4 flex flex-col items-center py-4 px-8 gap-2 border-r border-neutral-700">
          <FolderForm onSuccess={getFolders} />
          <FoldersList folders={folders} onSelect={(folder) => setSelectedFolder(folder)} selectedFolder={selectedFolder} />
        </aside>
        <main className="flex-1 flex flex-col items-center py-4 px-8 gap-2">
          {selectedFolder ? (
            <div className="flex gap-2 w-full justify-between">
              <h2  className="text-xl font-bold">{selectedFolder.name}</h2>
              {selectedFolder.type === "shared" && <PrimaryButton onClick={() => setIsSendInvitationsPopupVisible(true)}>Share</PrimaryButton>}
            </div>
          ) : (
            <div className="h-full flex items-center">
              <p>Please select a folder.</p>
            </div>
          )}
        </main>
        <aside className="w-1/4 flex flex-col items-center py-4 px-8 gap-2 border-l border-neutral-700">
          {selectedFolder && (
            <ElementForm onSuccess={getElements} folderId={selectedFolder._id.toString()} />
          )}
        </aside>
      </div>
      {selectedFolder && (
        <SendInvitationsPopup
          isVisible={isSendInvitationsPopupVisible}
          onClose={() => setIsSendInvitationsPopupVisible(false)}
          folderId={selectedFolder._id.toString()}
        />
      )}
    </>
  )
}
