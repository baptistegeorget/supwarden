"use client"

import Header from "@/components/Header"
import { SessionResponse, FolderResponse, ElementResponse } from "@/types"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useNotification } from "@/components/providers/NotificationProvider"
import { getSession } from "@/lib/auth"
import MembersPanel from "@/components/MembersPanel"
import ElementFormPanel from "@/components/ElementFormPanel"
import FoldersPanel from "@/components/FoldersPanel"

export default function HomePage() {
  const notify = useNotification()
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
        {/* {selectedFolder && (
          <main className="flex-1 flex flex-col items-center py-4 px-8 gap-2 overflow-auto scrollbar-thin">
            <div className="flex gap-2 w-full justify-between h-8">
              <h2 className="text-xl font-bold">{selectedFolder.name}</h2>
              <div className="flex gap-2">
                {selectedFolder.type === "shared" && (
                  <InvitationFormPopupButton
                    session={session}
                    folderId={selectedFolder.id}
                  />
                )}
                <button onClick={() => setRightPanelView("member")}>
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m3.5 14 10 .001a1.5 1.5 0 0 1 1.493 1.356L15 15.5V17.5C14.999 21 11.284 22 8.5 22c-2.722 0-6.335-.956-6.495-4.27L2 17.5v-2a1.5 1.5 0 0 1 1.356-1.493L3.5 14Zm11.988 0H20.5a1.5 1.5 0 0 1 1.493 1.355L22 15.5V17c-.001 3.062-2.858 4-5 4a7.16 7.16 0 0 1-2.14-.322c.653-.75 1.076-1.703 1.133-2.898L16 17.5v-2c0-.494-.15-.951-.399-1.338L15.488 14H20.5h-5.012ZM8.5 3a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Zm9 2a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Z" fill="#ffffff" /></svg>
                </button>
                <button onClick={() => setRightPanelView("message")}>
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10a9.96 9.96 0 0 1-4.644-1.142l-4.29 1.117a.85.85 0 0 1-1.037-1.036l1.116-4.289A9.959 9.959 0 0 1 2 12C2 6.477 6.477 2 12 2Zm1.252 11H8.75l-.102.007a.75.75 0 0 0 0 1.486l.102.007h4.502l.101-.007a.75.75 0 0 0 0-1.486L13.252 13Zm1.998-3.5h-6.5l-.102.007a.75.75 0 0 0 0 1.486L8.75 11h6.5l.102-.007a.75.75 0 0 0 0-1.486L15.25 9.5Z" fill="#ffffff" /></svg>
                </button>
                <button
                  onClick={() => {
                    setSelectedElement(null)
                    setElementFormMode("new")
                    setRightPanelView("form")
                  }}
                >
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11.883 3.007 12 3a1 1 0 0 1 .993.883L13 4v7h7a1 1 0 0 1 .993.883L21 12a1 1 0 0 1-.883.993L20 13h-7v7a1 1 0 0 1-.883.993L12 21a1 1 0 0 1-.993-.883L11 20v-7H4a1 1 0 0 1-.993-.883L3 12a1 1 0 0 1 .883-.993L4 11h7V4a1 1 0 0 1 .883-.993L12 3l-.117.007Z" fill="#ffffff" /></svg>
                </button>
              </div>
            </div>
            <ElementsList
              elements={elements}
              selectedElement={selectedElement}
              onSelect={(element) => {
                setSelectedElement(element)
                setElementFormMode("view")
                setRightPanelView("form")
              }}
            />
          </main>
        )} */}
        {selectedFolder && rightPanelView === "members" && <MembersPanel session={session} folder={selectedFolder} />}
        {selectedFolder && rightPanelView === "messages" && <></>}
        {selectedFolder && rightPanelView === "element-form" && <ElementFormPanel session={session} folder={selectedFolder} element={selectedElement} />}
        {/* {selectedFolder && (
          <aside className="flex flex-col py-4 px-8 gap-2 border-l border-neutral-700 w-96 overflow-auto scrollbar-thin">
            {panelView === "form" && (
              <>
                <div className="flex gap-2 justify-between">
                  <h2 className="text-xl font-bold">{elementFormMode === "new" ? "New" : elementFormMode === "edit" ? "Edit" : "View"}</h2>
                  {selectedElement && (
                    <div className="flex gap-2">
                      {elementFormMode === "edit" && (
                        <button onClick={() => setElementFormMode("view")}>
                          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m4.21 4.387.083-.094a1 1 0 0 1 1.32-.083l.094.083L12 10.585l6.293-6.292a1 1 0 1 1 1.414 1.414L13.415 12l6.292 6.293a1 1 0 0 1 .083 1.32l-.083.094a1 1 0 0 1-1.32.083l-.094-.083L12 13.415l-6.293 6.292a1 1 0 0 1-1.414-1.414L10.585 12 4.293 5.707a1 1 0 0 1-.083-1.32l.083-.094-.083.094Z" fill="#ffffff" /></svg>
                        </button>
                      )}
                      {elementFormMode === "view" && (selectedFolder.createdBy.id === session.user.id || selectedElement.createdBy.id === session.user.id || selectedElement.membersWhoCanEdit?.some(member => member.user.id === session.user.id)) && (
                        <>
                          <button onClick={() => setElementFormMode("edit")}>
                            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M13.94 5 19 10.06 9.062 20a2.25 2.25 0 0 1-.999.58l-5.116 1.395a.75.75 0 0 1-.92-.921l1.395-5.116a2.25 2.25 0 0 1 .58-.999L13.938 5Zm7.09-2.03a3.578 3.578 0 0 1 0 5.06l-.97.97L15 3.94l.97-.97a3.578 3.578 0 0 1 5.06 0Z" fill="#ffffff" /></svg>
                          </button>
                          <button onClick={() => deleteElement(selectedElement.id)}>
                            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21.5 6a1 1 0 0 1-.883.993L20.5 7h-.845l-1.231 12.52A2.75 2.75 0 0 1 15.687 22H8.313a2.75 2.75 0 0 1-2.737-2.48L4.345 7H3.5a1 1 0 0 1 0-2h5a3.5 3.5 0 1 1 7 0h5a1 1 0 0 1 1 1Zm-7.25 3.25a.75.75 0 0 0-.743.648L13.5 10v7l.007.102a.75.75 0 0 0 1.486 0L15 17v-7l-.007-.102a.75.75 0 0 0-.743-.648Zm-4.5 0a.75.75 0 0 0-.743.648L9 10v7l.007.102a.75.75 0 0 0 1.486 0L10.5 17v-7l-.007-.102a.75.75 0 0 0-.743-.648ZM12 3.5A1.5 1.5 0 0 0 10.5 5h3A1.5 1.5 0 0 0 12 3.5Z" fill="#ffffff" /></svg>
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
                <ElementForm
                  key={selectedElement ? selectedElement.id : "new"}
                  mode={elementFormMode}
                  folderId={selectedFolder.id}
                  members={members}
                  element={selectedElement ? selectedElement : undefined}
                  onSuccess={() => {
                    notify("Element created successfully", "success")
                    setElementFormMode("view")
                    getElements(selectedFolder.id)
                  }}
                  onFailure={(error) => notify(error, "error")}
                />
              </>
            )}
          </aside>
        )} */}
      </div>
    </>
  )
}
