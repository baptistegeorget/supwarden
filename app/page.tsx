"use client"

import PrimaryButton from "@/components/buttons/primary"
import FolderForm from "@/components/forms/folder"
import Header from "@/components/header"
import FoldersList from "@/components/lists/folders"
import SendInvitationsPopup from "@/components/popups/send-invitation"
import { auth } from "@/lib/auth"
import { ElementModel, Session, Folder } from "@/types"
import { WithId } from "mongodb"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import MembersList from "@/components/lists/members"

export default function HomePage() {
  const router = useRouter()
  const [session, setSession] = useState<Session | null>(null)
  const [folders, setFolders] = useState<Folder[]>([])
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null)
  const [elements, setElements] = useState<WithId<ElementModel>[]>([])
  const [selectedElement, setSelectedElement] = useState<WithId<ElementModel> | null>(null)
  const [isSendInvitationsPopupVisible, setIsSendInvitationsPopupVisible] = useState(false)
  const [isNotificationPopupVisible, setIsNotificationPopupVisible] = useState(false)

  useEffect(() => {
    async function getSession() {
      const session = await auth()
      if (session) {
        return setSession(session)
      } else {
        return router.push("/signin")
      }
    }
    getSession()
  }, [router])

  useEffect(() => {
    getFolders()
  }, [session])

  async function getFolders() {
    const response = await fetch("/api/folders", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (response.ok) {
      const { folders }: { folders: Folder[] } = await response.json()
      return setFolders(folders)
    } else {
      return setFolders([])
    }
  }

  async function getElements() {

  }

  return (
    <>
      {session && <Header session={session} />}
      <div className="flex flex-1">
        <aside className="w-1/4 flex flex-col items-center py-4 px-8 gap-2 border-r border-neutral-700">
          <FolderForm onSuccess={getFolders} />
          <FoldersList folders={folders} onSelect={(folder) => setSelectedFolder(folder)} />
        </aside>
        <main className="flex-1 flex flex-col items-center py-4 px-8 gap-2">
          {selectedFolder ? (
            <div className="flex gap-2 w-full justify-between">
              <h2 className="text-xl font-bold">{selectedFolder.name}</h2>
              {selectedFolder.type === "shared" && selectedFolder.creator?.id === session?.user.id && <PrimaryButton onClick={() => setIsSendInvitationsPopupVisible(true)}>Share</PrimaryButton>}
            </div>
          ) : (
            <div className="h-full flex items-center">
              <p>Please select a folder.</p>
            </div>
          )}
        </main>
        <aside className="w-1/4 flex flex-col items-center py-4 px-8 gap-2 border-l border-neutral-700">
          {selectedFolder && (
            <MembersList folder={selectedFolder} />
          )}
        </aside>
      </div>
      {selectedFolder && (
        <SendInvitationsPopup
          isVisible={isSendInvitationsPopupVisible}
          onClose={() => setIsSendInvitationsPopupVisible(false)}
          folderId={selectedFolder.id}
        />
      )}
    </>
  )
}
