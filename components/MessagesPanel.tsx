"use client"

import { FolderResponse, MessageResponse, SessionResponse, UserResponse } from "@/types"
import { useEffect, useState } from "react"
import { useNotification } from "@/components/NotificationProvider"

export default function MessagesPanel({
  session,
  folder
}: {
  session: SessionResponse,
  folder: FolderResponse
}) {
  const notify = useNotification()
  const [members, setMembers] = useState<UserResponse[]>([])
  const [recipient, setRecipient] = useState<UserResponse | null>(null)
  const [messages, setMessages] = useState<MessageResponse[]>([])

  useEffect(() => {
    fetchMembers(session.user.id, folder.id)
    fetchMessages(session.user.id, folder.id)
    const intervalId = setInterval(() => fetchMessages(session.user.id, folder.id), 3000)
    return () => clearInterval(intervalId)
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

  async function fetchMessages(userId: string, folderId: string) {
    const response = await fetch(`/api/users/${userId}/folders/${folderId}/messages`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })

    if (response.ok) {
      const { messages }: { messages: MessageResponse[] } = await response.json()
      setMessages(messages)
    } else {
      setMessages([])
    }
  }

  async function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)
    const body = Object.fromEntries(formData.entries())

    const response = await fetch(`/api/users/${session.user.id}/folders/${folder.id}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...body,
        recipient: recipient ? recipient.id : undefined
      })
    })

    if (response.ok) {
      fetchMessages(session.user.id, folder.id)
      form.reset()
    } else {
      const { error }: { error: string } = await response.json()
      notify(error, "error")
    }
  }

  return (
    <aside className="p-8 border-l border-neutral-700 w-96 flex flex-col gap-4">
      <select
        className="px-2 py-1 rounded border border-neutral-700 bg-transparent"
        value={recipient ? recipient.id : "general"}
        onChange={(event) => {
          const selected = members.find((member) => member.id === event.target.value)
          setRecipient(selected || null)
        }}
      >
        <option value="general" className="bg-black text-white">General</option>
        {members.filter((member) => member.id !== session.user.id).map((member) => (
          <option key={member.id} value={member.id} className="bg-black text-white">{member.name}</option>
        ))}
      </select>
      <div className="flex flex-col-reverse gap-2 h-full overflow-auto scrollbar-thin">
        {messages
          .filter((message) => recipient === null ? !message.recipient : (message.recipient?.id === recipient.id && message.createdBy.id === session.user.id) || (message.recipient?.id === session.user.id && message.createdBy.id === recipient.id))
          .sort((a, b) => new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime())
          .map((message) => (
            <div key={message.id} className={`flex ${message.createdBy.id === session.user.id ? "justify-end" : "justify-start"}`}>
              <div className="flex flex-col w-2/3">
                <p className={`text-neutral-700 text-xs ${message.createdBy.id === session.user.id ? "text-end" : "text-start"}`}><i>{message.createdBy.name} at {new Date(message.createdOn).toLocaleString()}</i></p>
                <div className={`rounded px-2 py-1 ${message.createdBy.id === session.user.id ? "text-black bg-white" : "border border-neutral-700"}`}>
                  <p>{message.body}</p>
                </div>
              </div>
            </div>
          ))}
      </div>
      <form onSubmit={submitForm}>
        <div className="flex gap-2 items-end">
          <textarea
            name="body"
            placeholder="Type a message..."
            className="flex-1 px-2 py-1 rounded border border-neutral-700 bg-transparent resize-none h-32 scrollbar-thin"
          />
          <button type="submit">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m12.815 12.197-7.532 1.256a.5.5 0 0 0-.386.318L2.3 20.728c-.248.64.421 1.25 1.035.943l18-9a.75.75 0 0 0 0-1.342l-18-9c-.614-.307-1.283.304-1.035.943l2.598 6.957a.5.5 0 0 0 .386.319l7.532 1.255a.2.2 0 0 1 0 .394Z" fill="#ffffff" /></svg>
          </button>
        </div>
      </form>
    </aside>
  )
}