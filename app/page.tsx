"use client"

import FolderForm from "@/components/forms/FolderForm"
import Header from "@/components/header"
import FoldersList from "@/components/lists/FoldersList"
import { auth } from "@/lib/auth"
import { SessionResponse, FolderResponse, MemberResponse, ElementResponse } from "@/types"
import { WithId } from "mongodb"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import MembersList from "@/components/lists/MembersList"
import TertiaryButton from "@/components/buttons/TertiaryButton"
import { useNotification } from "@/components/providers/NotificationProvider"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import ElementForm from "@/components/forms/ElementForm"
import SendInvitationPopupButton from "@/components/buttons/SendInvitationPopupButton"

export default function HomePage() {
  const notify = useNotification()
  const router = useRouter()
  const [session, setSession] = useState<SessionResponse | null>(null)
  const [folders, setFolders] = useState<FolderResponse[]>([])
  const [selectedFolder, setSelectedFolder] = useState<FolderResponse | null>(null)
  const [members, setMembers] = useState<WithId<MemberResponse>[]>([])
  const [rightPanelView, setRightPanelView] = useState<"member" | "form" | "message">("member")
  const [elementFormMode, setElementFormMode] = useState<"new" | "edit" | "view">("new")
  const [elements, setElements] = useState<WithId<ElementResponse>[]>([])
  const [selectedElement, setSelectedElement] = useState<WithId<ElementResponse> | null>(null)
  const [isInvitationFormPopupVisible, setIsInvitationFormPopupVisible] = useState(false)

  useEffect(() => {
    getSession(router)
  }, [router])

  useEffect(() => {
    getFolders()
  }, [session])

  useEffect(() => {
    if (selectedFolder) {
      getMembers(selectedFolder.id)
      getElements(selectedFolder.id)
    }
  }, [selectedFolder])

  async function getSession(router: AppRouterInstance) {
    const session = await auth()
    if (session) {
      return setSession(session)
    } else {
      return router.push("/signin")
    }
  }

  async function getFolders() {
    const response = await fetch("/api/folders", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
    if (response.ok) {
      const { folders } = await response.json()
      return setFolders(folders)
    } else {
      return setFolders([])
    }
  }

  async function getMembers(folderId: string) {
    const response = await fetch(`/api/members?folderId=${folderId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
    if (response.ok) {
      const { members } = await response.json()
      return setMembers(members)
    } else {
      return setMembers([])
    }
  }

  async function getElements(folderId: string) {
    const response = await fetch(`/api/elements?folderId=${folderId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
    if (response.ok) {
      const { elements } = await response.json()
      return setElements(elements)
    } else {
      return setElements([])
    }
  }

  if (!session) return null

  return (
    <>
      <Header session={session} />
      <div className="flex-1 flex min-h-0">
        <aside className="flex flex-col py-4 px-8 gap-2 border-r border-neutral-700 w-96 overflow-auto scrollbar-thin">
          <FolderForm
            onSuccess={() => {
              notify("Folder created successfully", "success")
              getFolders()
            }}
            onFailure={(error) => notify(error, "error")}
          />
          <FoldersList
            folders={folders}
            selectedFolder={selectedFolder}
            onSelect={(folder) => {
              setSelectedFolder(folder)
              setRightPanelView("member")
            }}
          />
        </aside>
        <main className="flex-1 flex flex-col items-center py-4 px-8 gap-2 overflow-auto scrollbar-thin">
          {selectedFolder && (
            <div className="flex gap-2 w-full justify-between">
              <h2 className="text-xl font-bold">{selectedFolder.name}</h2>
              <div className="flex gap-2">
                {selectedFolder.type === "shared" && selectedFolder.creator.id === session.user.id && (
                  <SendInvitationPopupButton folderId={selectedFolder.id} />
                )}
                <TertiaryButton
                  onClick={() => {
                    setSelectedElement(null)
                    setElementFormMode("new")
                    setRightPanelView("form")
                  }}
                >
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11.883 3.007 12 3a1 1 0 0 1 .993.883L13 4v7h7a1 1 0 0 1 .993.883L21 12a1 1 0 0 1-.883.993L20 13h-7v7a1 1 0 0 1-.883.993L12 21a1 1 0 0 1-.993-.883L11 20v-7H4a1 1 0 0 1-.993-.883L3 12a1 1 0 0 1 .883-.993L4 11h7V4a1 1 0 0 1 .883-.993L12 3l-.117.007Z" fill="#ffffff" /></svg>
                </TertiaryButton>
              </div>
            </div>
          )}
          {!selectedFolder && (
            <div className="h-full w-full flex items-center justify-center">
              <p className="text-neutral-500">No folder selected</p>
            </div>
          )}
        </main>
        {selectedFolder && (
          <aside className="flex flex-col py-4 px-8 gap-2 border-l border-neutral-700 w-96 overflow-auto scrollbar-thin">
            {rightPanelView === "member" && (
              <MembersList members={members} />
            )}
            {rightPanelView === "form" && (
              <ElementForm
                mode={elementFormMode}
                folderId={selectedFolder.id}
                elementId={selectedElement?.id}
                onSuccess={() => {
                  notify("Element created successfully", "success")
                  getElements(selectedFolder.id)
                }}
                onFailure={(error) => notify(error, "error")}
              />
            )}
          </aside>
        )}
      </div>
    </>
  )
}
