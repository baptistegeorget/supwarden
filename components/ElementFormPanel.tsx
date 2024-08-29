"use client"

import { ElementResponse, FolderResponse, SessionResponse, UserResponse } from "@/types"
import { useEffect, useState } from "react"
import { useNotification } from "@/components/NotificationProvider"
import { createPortal } from "react-dom"
import PasswordGenerator from "@/components/PasswordGenerator"

export default function ElementFormPanel({
  session,
  folder,
  element,
  onSuccess,
  onDelete
}: {
  session: SessionResponse,
  folder: FolderResponse,
  element?: ElementResponse
  onSuccess?: (element: ElementResponse) => void,
  onDelete?: () => void
}) {
  const notify = useNotification()
  const [mode, setMode] = useState<"new" | "edit" | "view">("new")
  const [members, setMembers] = useState<UserResponse[]>([])
  const [isGeneratePasswordPopupVisible, setIsGeneratePasswordPopupVisible] = useState(false)
  const [isLocked, setIsLocked] = useState<boolean>(element?.isSensitive || false)
  const [userPassword, setUserPassword] = useState<string>("")
  const [pin, setPin] = useState<string[]>(Array(6).fill(""))

  const [name, setName] = useState<string>(element?.name || "")
  const [identifier, setIdentifier] = useState<string>(element?.identifier || "")
  const [password, setPassword] = useState<string>(element?.password || "")
  const [urls, setUrls] = useState<string[]>(element?.urls || [])
  const [note, setNote] = useState<string>(element?.note || "")
  const [customFields, setCustomFields] = useState<{ type: "visible" | "hidden" | "attachment", value: string | { name: string, data: string } }[]>(element?.customFields || [])
  const [idsOfMembersWhoCanEdit, setIdsOfMembersWhoCanEdit] = useState<string[]>(element?.idsOfMembersWhoCanEdit || [])
  const [isSensitive, setIsSensitive] = useState<boolean>(element?.isSensitive || false)

  useEffect(() => {
    fetchMembers(session.user.id, folder.id)
  }, [folder, session])

  useEffect(() => {
    setIsLocked(element?.isSensitive || false)
    setUserPassword("")
    setPin(Array(6).fill(""))
    setName(element?.name || "")
    setIdentifier(element?.identifier || "")
    setPassword(element?.password || "")
    setUrls(element?.urls || [])
    setNote(element?.note || "")
    setCustomFields(element?.customFields || [])
    setIdsOfMembersWhoCanEdit(element?.idsOfMembersWhoCanEdit || [])
    setIsSensitive(element?.isSensitive || false)
    setMode(element ? "view" : "new")
  }, [element])

  function downloadFile(file: { name: string, data: string }) {
    // Extract base64 data and mime type from the file
    const base64 = file.data.split(",")[1]
    const mime = file.data.split(":")[1].split(";")[0]

    // Convert base64 to binary data
    const byteCharacters = atob(base64)

    // Convert binary data to array buffer
    const byteNumbers = new Array(byteCharacters.length)

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }

    const byteArray = new Uint8Array(byteNumbers)

    // Create a blob object
    const blob = new Blob([byteArray], { type: mime })

    // Create a temporary URL for the blob object and download it as a file
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = file.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

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

  async function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (mode === "new") {
      const response = await fetch(`/api/users/${session.user.id}/folders/${folder.id}/elements`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          identifier,
          password,
          urls,
          note,
          customFields,
          idsOfMembersWhoCanEdit,
          isSensitive
        })
      })

      if (response.ok) {
        const { message, element }: { message: string, element: ElementResponse } = await response.json()
        notify(message, "success")
        onSuccess?.(element)
      } else {
        const { error }: { error: string } = await response.json()
        notify(error, "error")
      }
    } else if (mode === "edit") {
      const response = await fetch(`/api/users/${session.user.id}/folders/${folder.id}/elements/${element?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          identifier,
          password,
          urls,
          note,
          customFields,
          idsOfMembersWhoCanEdit,
          isSensitive
        })
      })

      if (response.ok) {
        const { message, element }: { message: string, element: ElementResponse } = await response.json()
        notify(message, "success")
        onSuccess?.(element)
      } else {
        const { error }: { error: string } = await response.json()
        notify(error, "error")
      }
    }
  }

  async function deleteElement(userId: string, folderId: string, elementId: string) {
    const response = await fetch(`/api/users/${userId}/folders/${folderId}/elements/${elementId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    })

    if (response.ok) {
      const { message }: { message: string } = await response.json()
      notify(message, "success")
    } else {
      const { error }: { error: string } = await response.json()
      notify(error, "error")
    }
  }

  if (isLocked) {
    return (
      <aside className="p-8 border-l border-neutral-700 w-96 flex flex-col justify-center gap-4">
        {session.user.hasPin && (
          <form>
            <div className="flex flex-col gap-1">
              <label>Enter your PIN to unlock this element</label>
              <div className="flex gap-2">
                {pin.map((_, index) => (
                  <input
                    key={index}
                    id={`pin-input-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={pin[index]}
                    onChange={async (event) => {
                      const pinCopy = [...pin]
                      pinCopy[index] = event.target.value
                      setPin(pinCopy)

                      if (event.target.value && index < pin.length - 1) {
                        document.getElementById(`pin-input-${index + 1}`)?.focus()
                      }

                      if (!event.target.value && index > 0) {
                        document.getElementById(`pin-input-${index - 1}`)?.focus()
                      }

                      if (pinCopy.every((value) => value !== "")) {
                        const response = await fetch(`/api/users/${session.user.id}/check-password-or-pin`, {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json"
                          },
                          body: JSON.stringify({ pin: pin.join("") })
                        })

                        if (response.ok) {
                          setIsLocked(false)
                        } else {
                          const { error }: { error: string } = await response.json()
                          notify(error, "error")
                        }
                      }
                    }}
                    autoFocus={index === 0}
                    className="px-2 py-1 rounded bg-transparent border border-neutral-700 w-8 text-center"
                  />
                ))}
              </div>
            </div>
          </form>
        )}
        {!session.user.hasPin && (
          <form action={async () => {
            const response = await fetch(`/api/users/${session.user.id}/check-password-or-pin`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({ password: userPassword })
            })

            if (response.ok) {
              setIsLocked(false)
            } else {
              const { error }: { error: string } = await response.json()
              notify(error, "error")
            }
          }}>
            <div className="flex flex-col gap-1">
              <label htmlFor="password">Enter your password to unlock this element</label>
              <input
                id="userPassword"
                name="userPassword"
                type="text"
                placeholder="Enter your password..."
                className="px-2 py-1 rounded bg-transparent border border-neutral-700 w-full"
                value={userPassword}
                onChange={(event) => setUserPassword(event.target.value)}
              />
            </div>
          </form>
        )}
      </aside>
    )
  } else {
    return (
      <>
        <aside className="p-8 border-l border-neutral-700 w-96 flex flex-col gap-4 overflow-auto scrollbar-thin">
          <div className="flex gap-2 justify-between">
            <h2 className="text-xl font-bold">{mode === "new" ? "New element" : element && element.name.length > 16 ? `${element.name.slice(0, 16)}...` : element?.name}</h2>
            <div className="flex gap-2">
              {mode === "view" && element && (folder.createdBy.id === session.user.id || element.createdBy.id === session.user.id || element.idsOfMembersWhoCanEdit.includes(session.user.id)) && (
                <button onClick={() => setMode("edit")}>
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M13.94 5 19 10.06 9.062 20a2.25 2.25 0 0 1-.999.58l-5.116 1.395a.75.75 0 0 1-.92-.921l1.395-5.116a2.25 2.25 0 0 1 .58-.999L13.938 5Zm7.09-2.03a3.578 3.578 0 0 1 0 5.06l-.97.97L15 3.94l.97-.97a3.578 3.578 0 0 1 5.06 0Z" fill="#ffffff" /></svg>
                </button>
              )}
              {mode === "edit" && element && (
                <button
                  onClick={() => {
                    setName(element.name)
                    setIdentifier(element.identifier)
                    setPassword(element.password)
                    setUrls(element.urls)
                    setNote(element.note)
                    setCustomFields(element.customFields)
                    setIdsOfMembersWhoCanEdit(element.idsOfMembersWhoCanEdit)
                    setIsSensitive(element.isSensitive)
                    setMode("view")
                  }}
                >
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m4.21 4.387.083-.094a1 1 0 0 1 1.32-.083l.094.083L12 10.585l6.293-6.292a1 1 0 1 1 1.414 1.414L13.415 12l6.292 6.293a1 1 0 0 1 .083 1.32l-.083.094a1 1 0 0 1-1.32.083l-.094-.083L12 13.415l-6.293 6.292a1 1 0 0 1-1.414-1.414L10.585 12 4.293 5.707a1 1 0 0 1-.083-1.32l.083-.094-.083.094Z" fill="#ffffff" /></svg>
                </button>
              )}
              {mode === "view" && element && (folder.createdBy.id === session.user.id || element.createdBy.id === session.user.id || element.idsOfMembersWhoCanEdit.includes(session.user.id)) && (
                <button
                  onClick={() => {
                    deleteElement(session.user.id, folder.id, element.id)
                    onDelete?.()
                  }}
                >
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21.5 6a1 1 0 0 1-.883.993L20.5 7h-.845l-1.231 12.52A2.75 2.75 0 0 1 15.687 22H8.313a2.75 2.75 0 0 1-2.737-2.48L4.345 7H3.5a1 1 0 0 1 0-2h5a3.5 3.5 0 1 1 7 0h5a1 1 0 0 1 1 1Zm-7.25 3.25a.75.75 0 0 0-.743.648L13.5 10v7l.007.102a.75.75 0 0 0 1.486 0L15 17v-7l-.007-.102a.75.75 0 0 0-.743-.648Zm-4.5 0a.75.75 0 0 0-.743.648L9 10v7l.007.102a.75.75 0 0 0 1.486 0L10.5 17v-7l-.007-.102a.75.75 0 0 0-.743-.648ZM12 3.5A1.5 1.5 0 0 0 10.5 5h3A1.5 1.5 0 0 0 12 3.5Z" fill="#ffffff" /></svg>
                </button>
              )}
            </div>
          </div>
          <form onSubmit={submitForm} className="flex flex-col gap-2 items-center">
            {(mode === "new" || mode === "edit" || (mode === "view" && element && element.name !== "")) && (
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="name">{mode !== "view" && "*"} Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter a name..."
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  min={1}
                  max={32}
                  readOnly={mode === "view"}
                  onClick={async (event) => {
                    if (mode === "view") {
                      await navigator.clipboard.writeText(event.currentTarget.value)
                      notify("Name copied to clipboard", "success")
                    }
                  }}
                  className={`px-2 py-1 rounded bg-transparent border border-neutral-700 w-full ${mode === "view" && "cursor-pointer"}`}
                />
              </div>
            )}
            {(mode === "new" || mode === "edit" || (mode === "view" && element && element.identifier !== "")) && (
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="identifier">Identifier</label>
                <input
                  id="identifier"
                  name="identifier"
                  type="text"
                  placeholder="Enter an identifier..."
                  value={identifier}
                  onChange={(event) => setIdentifier(event.target.value)}
                  max={32}
                  readOnly={mode === "view"}
                  onClick={async (event) => {
                    if (mode === "view") {
                      await navigator.clipboard.writeText(event.currentTarget.value)
                      notify("Identifier copied to clipboard", "success")
                    }
                  }}
                  className={`px-2 py-1 rounded bg-transparent border border-neutral-700 w-full ${mode === "view" && "cursor-pointer"}`}
                />
              </div>
            )}
            {(mode === "new" || mode === "edit" || (mode === "view" && element && element.password !== "")) && (
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="password">Password</label>
                <div className="flex gap-2">
                  <input
                    id="password"
                    name="password"
                    type={mode === "view" ? "password" : "text"}
                    placeholder="Enter a password..."
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    max={32}
                    readOnly={mode === "view"}
                    onClick={async (event) => {
                      if (mode === "view") {
                        await navigator.clipboard.writeText(event.currentTarget.value)
                        notify("Password copied to clipboard", "success")
                      }
                    }}
                    className={`px-2 py-1 rounded bg-transparent border border-neutral-700 w-full ${mode === "view" && "cursor-pointer"}`}
                  />
                  {(mode === "edit" || mode === "new") && (
                    <button type="button" onClick={() => setIsGeneratePasswordPopupVisible(true)}>
                      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2Zm0 5a.75.75 0 0 0-.743.648l-.007.102v3.5h-3.5a.75.75 0 0 0-.102 1.493l.102.007h3.5v3.5a.75.75 0 0 0 1.493.102l.007-.102v-3.5h3.5a.75.75 0 0 0 .102-1.493l-.102-.007h-3.5v-3.5A.75.75 0 0 0 12 7Z" fill="#ffffff" /></svg>
                    </button>
                  )}
                </div>
              </div>
            )}
            {(mode === "new" || mode === "edit" || (mode === "view" && element && element.urls.length > 0)) && (
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="urls">URLs</label>
                {(mode === "new" || mode === "edit") && (
                  <input
                    id="urls"
                    name="urls"
                    type="text"
                    placeholder="Enter an URL..."
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault()
                        const value = event.currentTarget.value.trim()
                        if (!value.startsWith("http://") && !value.startsWith("https://")) {
                          notify("The URL must start with http:// or https://", "error")
                        } else {
                          setUrls([...urls, value])
                          event.currentTarget.value = ""
                        }
                      }
                    }}
                    className="px-2 py-1 rounded bg-transparent border border-neutral-700 w-full"
                  />
                )}
                <div className="flex flex-wrap gap-1">
                  {urls?.map((url, index) => (
                    <div key={index} className="bg-blue-700 flex gap-2 px-2 py-1 rounded-full items-center">
                      <a href={url} target="_blank">
                        <p className="text-xs">{url.length > 24 ? `${url.slice(0, 24)}...` : url}</p>
                      </a>
                      {(mode === "new" || mode === "edit") && (
                        <button type="button" onClick={() => setUrls(urls.filter((_, i) => i !== index))}>
                          <svg width="12" height="12" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m4.21 4.387.083-.094a1 1 0 0 1 1.32-.083l.094.083L12 10.585l6.293-6.292a1 1 0 1 1 1.414 1.414L13.415 12l6.292 6.293a1 1 0 0 1 .083 1.32l-.083.094a1 1 0 0 1-1.32.083l-.094-.083L12 13.415l-6.293 6.292a1 1 0 0 1-1.414-1.414L10.585 12 4.293 5.707a1 1 0 0 1-.083-1.32l.083-.094-.083.094Z" fill="#ffffff" /></svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {(mode === "new" || mode === "edit" || (mode === "view" && element && element.note !== "")) && (
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="note">Note</label>
                <textarea
                  id="note"
                  name="note"
                  placeholder="Enter a note..."
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  maxLength={512}
                  readOnly={mode === "view"}
                  onClick={async (event) => {
                    if (mode === "view") {
                      await navigator.clipboard.writeText(event.currentTarget.value)
                      notify("Note copied to clipboard", "success")
                    }
                  }}
                  className={`px-2 py-1 rounded bg-transparent border border-neutral-700 w-full resize-none scrollbar-thin h-32 ${mode === "view" && "cursor-pointer"}`}
                />
              </div>
            )}
            {(mode === "new" || mode === "edit" || (mode === "view" && element && element.customFields.length > 0)) && (
              <div className="flex flex-col gap-1 w-full">
                <label>Custom fields</label>
                {customFields.map((customField, index) => (
                  <div key={index} className="flex gap-2">
                    {mode === "view" && customField.type === "attachment" && (
                      <button
                        type="button"
                        onClick={() => downloadFile(customField.value as { name: string, data: string })}
                        className="px-2 py-1 rounded flex gap-2 w-full border border-neutral-700"
                      >
                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5.25 20.5h13.498a.75.75 0 0 1 .101 1.493l-.101.007H5.25a.75.75 0 0 1-.102-1.494l.102-.006h13.498H5.25Zm6.633-18.498L12 1.995a1 1 0 0 1 .993.883l.007.117v12.59l3.294-3.293a1 1 0 0 1 1.32-.083l.094.084a1 1 0 0 1 .083 1.32l-.083.094-4.997 4.996a1 1 0 0 1-1.32.084l-.094-.083-5.004-4.997a1 1 0 0 1 1.32-1.498l.094.083L11 15.58V2.995a1 1 0 0 1 .883-.993L12 1.995l-.117.007Z" fill="#ffffff" /></svg>
                        {(customField.value as { name: string, data: string }).name.length > 32 ? `${(customField.value as { name: string, data: string }).name.slice(0, 32)}...` : (customField.value as { name: string, data: string }).name}
                      </button>
                    )}
                    {(mode === "new" || mode === "edit") && customField.type === "attachment" && (
                      <input
                        type="file"
                        onChange={async (event) => {
                          const file = event.target.files?.[0]
                          if (file) {
                            const reader = new FileReader()
                            reader.onload = () => {
                              const customFieldsCopy = [...customFields]
                              customFieldsCopy[index].value = { name: file.name, data: reader.result as string }
                              setCustomFields(customFieldsCopy)
                            }
                            reader.readAsDataURL(file)
                          }
                        }}
                        className="w-full"
                      />
                    )}
                    {(customField.type === "visible" || customField.type === "hidden") && (
                      <input
                        type={mode === "view" && customField.type === "hidden" ? "password" : "text"}
                        placeholder="Enter a value..."
                        value={customField.value as string}
                        onChange={(event) => {
                          const customFieldsCopy = [...customFields]
                          customFieldsCopy[index].value = event.target.value
                          setCustomFields(customFieldsCopy)
                        }}
                        required
                        min={1}
                        max={32}
                        readOnly={mode === "view"}
                        onClick={async (event) => {
                          if (mode === "view") {
                            await navigator.clipboard.writeText(event.currentTarget.value)
                            notify("Value copied to clipboard", "success")
                          }
                        }}
                        className={`px-2 py-1 rounded bg-transparent border border-neutral-700 w-full ${mode === "view" && "cursor-pointer"}`}
                      />
                    )}
                    {(mode === "new" || mode === "edit") && (
                      <button type="button" onClick={() => setCustomFields(customFields.filter((_, i) => i !== index))}>
                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21.5 6a1 1 0 0 1-.883.993L20.5 7h-.845l-1.231 12.52A2.75 2.75 0 0 1 15.687 22H8.313a2.75 2.75 0 0 1-2.737-2.48L4.345 7H3.5a1 1 0 0 1 0-2h5a3.5 3.5 0 1 1 7 0h5a1 1 0 0 1 1 1Zm-7.25 3.25a.75.75 0 0 0-.743.648L13.5 10v7l.007.102a.75.75 0 0 0 1.486 0L15 17v-7l-.007-.102a.75.75 0 0 0-.743-.648Zm-4.5 0a.75.75 0 0 0-.743.648L9 10v7l.007.102a.75.75 0 0 0 1.486 0L10.5 17v-7l-.007-.102a.75.75 0 0 0-.743-.648ZM12 3.5A1.5 1.5 0 0 0 10.5 5h3A1.5 1.5 0 0 0 12 3.5Z" fill="#ffffff" /></svg>
                      </button>
                    )}
                  </div>
                ))}
                {(mode === "new" || mode === "edit") && (
                  <div className="flex gap-2 justify-center">
                    <button type="button" onClick={() => setCustomFields([...customFields, { type: "attachment", value: { name: "", data: "" } }])}>
                      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2v6a2 2 0 0 0 2 2h6v10a2 2 0 0 1-2 2h-6.81A6.5 6.5 0 0 0 4 11.498V4a2 2 0 0 1 2-2h6Z" fill="#ffffff" /><path d="M13.5 2.5V8a.5.5 0 0 0 .5.5h5.5l-6-6ZM12 17.5a5.5 5.5 0 1 0-11 0 5.5 5.5 0 0 0 11 0ZM7 18l.001 2.503a.5.5 0 1 1-1 0V18H3.496a.5.5 0 0 1 0-1H6v-2.5a.5.5 0 1 1 1 0V17h2.497a.5.5 0 0 1 0 1H7Z" fill="#ffffff" /></svg>
                    </button>
                    <button type="button" onClick={() => setCustomFields([...customFields, { type: "visible", value: "" }])}>
                      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3.75 5a1 1 0 0 1 1-1h12.5a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0V6H12v8.034a6.47 6.47 0 0 0-1 3.466c0 .886.177 1.73.498 2.5H9a1 1 0 1 1 0-2h1V6H5.75v1a1 1 0 0 1-2 0V5ZM23 17.5a5.5 5.5 0 1 0-11 0 5.5 5.5 0 0 0 11 0Zm-5 .5.001 2.503a.5.5 0 1 1-1 0V18h-2.505a.5.5 0 0 1 0-1H17v-2.5a.5.5 0 1 1 1 0V17h2.497a.5.5 0 0 1 0 1H18Z" fill="#ffffff" /></svg>
                    </button>
                    <button type="button" onClick={() => setCustomFields([...customFields, { type: "hidden", value: "" }])}>
                      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5.25 5A3.25 3.25 0 0 0 2 8.25v7.5A3.25 3.25 0 0 0 5.25 19h13.5A3.25 3.25 0 0 0 22 15.75v-7.5A3.25 3.25 0 0 0 18.75 5H5.25Zm1.03 5.22.72.72.72-.72a.75.75 0 1 1 1.06 1.06l-.719.72.72.718A.75.75 0 1 1 7.72 13.78L7 13.06l-.72.72a.75.75 0 0 1-1.06-1.06l.72-.72-.72-.72a.75.75 0 0 1 1.06-1.06Zm5.5 0 .72.72.72-.72a.75.75 0 1 1 1.06 1.06l-.719.72.72.718a.75.75 0 1 1-1.061 1.061l-.72-.719-.72.72a.75.75 0 1 1-1.06-1.06l.72-.72-.72-.72a.75.75 0 0 1 1.06-1.06Zm3.97 4.03a.75.75 0 0 1 .75-.75h1.75a.75.75 0 0 1 0 1.5H16.5a.75.75 0 0 1-.75-.75Z" fill="#ffffff" /></svg>
                    </button>
                  </div>
                )}
              </div>
            )}
            {(mode === "new" || mode === "edit" || (mode === "view" && element && element.idsOfMembersWhoCanEdit.length > 0)) && (
              <div className="flex flex-col gap-1 w-full">
                <label>Members who can edit</label>
                <div className="flex flex-col gap-1 ml-4">
                  {members.map((member, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        id={`ids-of-members-who-can-edit-${index}`}
                        type="checkbox"
                        checked={idsOfMembersWhoCanEdit.includes(member.id)}
                        onChange={(event) => {
                          if (mode === "view") return
                          if (event.target.checked) {
                            setIdsOfMembersWhoCanEdit([...idsOfMembersWhoCanEdit, member.id])
                          } else {
                            setIdsOfMembersWhoCanEdit(idsOfMembersWhoCanEdit.filter((id) => id !== member.id))
                          }
                        }}
                      />
                      <label htmlFor={`ids-of-members-who-can-edit-${index}`}>{member.name}</label>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {(mode === "new" || mode === "edit" || (mode === "view" && element)) && (
              <div className="flex flex-col gap-1 w-full">
                <label>Is sensitive</label>
                <div className="flex gap-2 ml-4">
                  <div className="flex gap-2 items-center">
                    <input
                      id="is-sensitive-yes"
                      name="isSensitive"
                      type="radio"
                      checked={isSensitive}
                      onChange={() => {
                        if (mode === "view") return
                        setIsSensitive(true)
                      }}
                    />
                    <label htmlFor="is-sensitive-yes">Yes</label>
                  </div>
                  <div className="flex gap-2 items-center">
                    <input
                      id="is-sensitive-no"
                      name="isSensitive"
                      type="radio"
                      checked={!isSensitive}
                      onChange={() => {
                        if (mode === "view") return
                        setIsSensitive(false)
                      }}
                    />
                    <label htmlFor="is-sensitive-no">No</label>
                  </div>
                </div>
              </div>
            )}
            {(mode === "new" || mode === "edit") && (
              <button type="submit" className="px-2 py-1 rounded bg-white text-black">
                {mode === "new" ? "Create" : "Save"}
              </button>
            )}
          </form>
        </aside>
        {isGeneratePasswordPopupVisible && createPortal(
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-black py-8 px-16 rounded-md shadow-lg border border-neutral-700 flex flex-col items-center gap-2">
              <h2 className="text-xl font-bold">Password generator</h2>
              <PasswordGenerator />
              <button onClick={() => setIsGeneratePasswordPopupVisible(false)} className="px-2 py-1 rounded bg-transparent border border-neutral-700 text-white">Close</button>
            </div>
          </div>,
          document.body
        )}
      </>
    )
  }
}