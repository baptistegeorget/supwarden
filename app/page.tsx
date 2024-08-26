"use client"

import { SessionResponse, FolderResponse, ElementResponse } from "@/types"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getSession } from "@/lib/auth"
import Header from "@/components/Header"
import MembersPanel from "@/components/MembersPanel"
import ElementFormPanel from "@/components/ElementFormPanel"
import FoldersPanel from "@/components/FoldersPanel"
import ElementsPanel from "@/components/ElementsPanel"

export default function HomePage() {
  const router = useRouter()
  const [session, setSession] = useState<SessionResponse | null>(null)
  const [selectedFolder, setSelectedFolder] = useState<FolderResponse | undefined>(undefined)
  const [selectedElement, setSelectedElement] = useState<ElementResponse | undefined>(undefined)
  const [rightPanelView, setRightPanelView] = useState<"members" | "element-form" | "messages">("members")

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
        <FoldersPanel
          session={session}
          onSelect={(folder) => {
            setSelectedFolder(folder)
            setSelectedElement(undefined)
            setRightPanelView("members")
          }}
        />
        {selectedFolder && (
          <ElementsPanel
            session={session}
            folder={selectedFolder}
            onSelect={(element) => {
              setSelectedElement(element)
              setRightPanelView("element-form")
            }}
          />
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
            element={selectedElement}
          />
        )}
        {selectedFolder && rightPanelView === "messages" && (
          <></>
        )}
      </div>
    </>
  )
}
