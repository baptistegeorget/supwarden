"use client"

import { PrimaryButton } from "@/components/buttons"
import { FolderForm } from "@/components/forms"
import { FoldersList } from "@/components/lists"
import { Title } from "@/components/miscellaneous"
import { SendInvitationsPopup } from "@/components/popups"
import { getAuthToken } from "@/lib/auth"
import { Folder, Element } from "@/types"
import { WithId } from "mongodb"
import { useEffect, useState } from "react"

export default function HomePage() {
  const [folders, setFolders] = useState<WithId<Folder>[]>([])
  const [selectedFolder, setSelectedFolder] = useState<WithId<Folder> | null>(null)
  const [elements, setElements] = useState<WithId<Element>[]>([])
  const [selectedElement, setSelectedElement] = useState<WithId<Element> | null>(null)
  const [isSendInvitationsPopupVisible, setIsSendInvitationsPopupVisible] = useState(false)

  useEffect(() => {
    getFolders()
  }, [])

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

  return (
    <>
      <div className="flex flex-1">
        <aside className="w-1/4 flex flex-col items-center py-4 px-8 gap-2 border-r border-neutral-700">
          <FolderForm onSuccess={getFolders} />
          <FoldersList folders={folders} onSelect={(folder) => setSelectedFolder(folder)} selectedFolder={selectedFolder} />
        </aside>
        <main className="flex-1 flex flex-col items-center py-4 px-8 gap-2">
          {selectedFolder && (
            <div className="flex gap-2 w-full justify-between">
              <Title>{selectedFolder.name}</Title>
              <PrimaryButton onClick={() => setIsSendInvitationsPopupVisible(true)}>Share</PrimaryButton>
            </div>
          )}
        </main>
        <aside className="w-1/4 flex flex-col items-center py-4 px-8 gap-2 border-l border-neutral-700">

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
