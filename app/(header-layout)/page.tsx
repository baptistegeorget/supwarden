"use client"

import { CreateFolderForm } from "@/components/forms"
import { FoldersList } from "@/components/lists"
import { getAuthToken } from "@/lib/auth"
import { Folder, Element } from "@/types"
import { WithId } from "mongodb"
import { useEffect, useState } from "react"

export default function HomePage() {
  const [folders, setFolders] = useState<WithId<Folder>[]>([])
  const [selectedFolder, setSelectedFolder] = useState<WithId<Folder> | null>(null)
  const [elements, setElements] = useState<WithId<Element>[]>([])
  const [selectedElement, setSelectedElement] = useState<WithId<Element> | null>(null)

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
        <aside className="w-1/4 border-r border-neutral-700 flex flex-col items-center py-4 px-8 gap-2">
          <CreateFolderForm onSuccess={getFolders} />
          <FoldersList folders={folders} onSelect={(folder) => setSelectedFolder(folder)} selectedFolder={selectedFolder} />
        </aside>
        <main className="flex-1 flex">
          {selectedFolder && <p>{selectedFolder.name}</p>}
        </main>
        <aside className="w-1/4 border-l border-neutral-700 flex flex-col items-center py-4 px-8 gap-2">

        </aside>
      </div>
    </>
  )
}
