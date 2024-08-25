"use client"

import { FolderResponse, SessionResponse, UserResponse } from "@/types"
import { useEffect, useState } from "react"

export default function MembersPanel({
  session,
  folder
}: {
  session: SessionResponse,
  folder: FolderResponse
}) {
  const [members, setMembers] = useState<UserResponse[]>([])

  useEffect(() => {
    fetchMembers(session.user.id, folder.id)
  }, [folder, session])

  async function fetchMembers(userId: string, folderId: string) {
    const response = await fetch(`/api/users/${userId}/folders/${folderId}/members`, {
      method: "GET",
      headers: { 
        "Content-Type": "application/json"
      }
    })

    if (response.ok) {
      const { members }: { members: UserResponse[] } = await response.json()
      setMembers(members)
    } else {
      setMembers([])
    }
  }

  return (
    <aside className="py-4 px-8 border-l border-neutral-700 w-96 overflow-auto scrollbar-thin">
      {members.map((member) => (
        <div key={member.id} className="flex gap-2 items-center">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.754 14a2.249 2.249 0 0 1 2.25 2.249v.918a2.75 2.75 0 0 1-.513 1.599C17.945 20.929 15.42 22 12 22c-3.422 0-5.945-1.072-7.487-3.237a2.75 2.75 0 0 1-.51-1.595v-.92a2.249 2.249 0 0 1 2.249-2.25h11.501ZM12 2.004a5 5 0 1 1 0 10 5 5 0 0 1 0-10Z" fill="#ffffff" /></svg>
          <div>
            <p>{member.name}</p>
            <p className="text-sm text-neutral-500">{member.email}</p>
          </div>
        </div>
      ))}
    </aside>
  )
}