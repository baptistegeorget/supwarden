"use client"

import { createSharedFolder } from "@/lib/actions"
import { useState } from "react"

export function CreateFolderPopup({ isVisible, onClose }: { isVisible: boolean, onClose: () => void }) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  if (!isVisible) return null

  async function handleSubmit(formData: FormData) {
    const error = await createSharedFolder(formData)
    if (error) {
      setErrorMessage(error)
    } else {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
      <div className="bg-black border border-neutral-700 py-8 px-16 rounded-md shadow-lg">
        <form
          className="flex flex-col gap-2"
          action={handleSubmit}
        >
          <input
            type="text"
            name="name"
            minLength={1}
            required={true}
            placeholder="Enter folder name"
            className="py-1 px-2 rounded w-full border border-neutral-700 bg-transparent"
          />
          <div>{errorMessage && <p className="text-red-500">{errorMessage}</p>}</div>
          <div className="flex gap-2">
            <button onClick={onClose} className="flex items-center bg-black text-white px-4 py-2 rounded-md shadow-lg border border-neutral-700 flex-1 justify-center">Cancel</button>
            <button type="submit" className="flex items-center bg-white text-black px-4 py-2 rounded-md shadow-lg flex-1 justify-center">Create</button>
          </div>
        </form>
      </div>
    </div>
  )
}