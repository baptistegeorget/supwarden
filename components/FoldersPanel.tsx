import { FolderResponse, SessionResponse } from "@/types"
import { useEffect, useState } from "react"
import { useNotification } from "@/components/providers/NotificationProvider"

export default function FoldersPanel({
  session,
  selectedFolder,
  onSelect
}: {
  session: SessionResponse,
  selectedFolder?: FolderResponse,
  onSelect?: (folder: FolderResponse) => void
}) {
  const notify = useNotification()
  const [folders, setFolders] = useState<FolderResponse[]>([])

  useEffect(() => {
    fetchFolders(session.user.id)
  }, [session])

  async function fetchFolders(userId: string) {
    const response = await fetch(`/api/users/${userId}/folders`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })

    if (response.ok) {
      const { folders }: { folders: FolderResponse[] } = await response.json()
      setFolders(folders)
    } else {
      setFolders([])
    }
  }

  async function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)
    const body = Object.fromEntries(formData.entries())

    const response = await fetch(`/api/users/${session.user.id}/folders`, {
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
      fetchFolders(session.user.id)
    } else {
      const { error }: { error: string } = await response.json()
      notify(error, "error")
    }
  }

  return (
    <aside className="p-8 border-r border-neutral-700 w-96 flex flex-col gap-4">
      <form onSubmit={submitForm} className="flex gap-2 items-center w-full">
        <input type="text" name="name" placeholder="Enter folder name..." className="px-2 py-1 rounded bg-transparent border border-neutral-700 w-full" required />
        <button type="submit" className="px-2 py-1 rounded bg-white text-black">Create</button>
      </form>
      <div className="flex flex-col gap-1 overflow-auto scrollbar-thin">
        {folders.map((folder) => (
          <button
            key={folder.id}
            onClick={() => onSelect?.(folder)}
            className={`flex gap-2 items-center px-2 py-1 rounded w-full ${folder.id === selectedFolder?.id ? "bg-white text-black" : "bg-black text-white"}`}
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M13.821 6.5h5.929a2.25 2.25 0 0 1 2.229 1.938l.016.158.005.154v9a2.25 2.25 0 0 1-2.096 2.245L19.75 20H4.25a2.25 2.25 0 0 1-2.245-2.096L2 17.75v-7.251l6.207.001.196-.009a2.25 2.25 0 0 0 1.088-.393l.156-.12L13.821 6.5ZM8.207 4c.46 0 .908.141 1.284.402l.156.12 2.103 1.751-3.063 2.553-.085.061a.75.75 0 0 1-.29.106L8.206 9 2 8.999V6.25a2.25 2.25 0 0 1 2.096-2.245L4.25 4h3.957Z" fill={folder.id === selectedFolder?.id ? "#000000" : "#ffffff"} /></svg>
            {folder.name}
            {folder.type === "private" && <i className="text-neutral-700">(private)</i>}
          </button>
        ))}
      </div>
    </aside>
  )
}