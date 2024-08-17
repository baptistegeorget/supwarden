"use client"

import { FolderResponse } from "@/types"

export default function FoldersList({
  folders,
  selectedFolder,
  onSelect
}: {
  folders: FolderResponse[],
  selectedFolder?: FolderResponse,
  onSelect?: (folder: FolderResponse) => void
}) {
  return (
    <div className="flex flex-col gap-2 w-full">
      {folders.map((folder) => (
        <button
          className={`flex gap-2 items-center justify-start p-1 ${folder.id === selectedFolder?.id ? "bg-white text-black" : "bg-black text-white"} rounded`}
          key={folder.id}
          onClick={() => {
            if (onSelect) onSelect(folder)
          }}
        >
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M13.821 6.5h5.929a2.25 2.25 0 0 1 2.229 1.938l.016.158.005.154v9a2.25 2.25 0 0 1-2.096 2.245L19.75 20H4.25a2.25 2.25 0 0 1-2.245-2.096L2 17.75v-7.251l6.207.001.196-.009a2.25 2.25 0 0 0 1.088-.393l.156-.12L13.821 6.5ZM8.207 4c.46 0 .908.141 1.284.402l.156.12 2.103 1.751-3.063 2.553-.085.061a.75.75 0 0 1-.29.106L8.206 9 2 8.999V6.25a2.25 2.25 0 0 1 2.096-2.245L4.25 4h3.957Z" fill={folder.id === selectedFolder?.id ? "#000000" : "#ffffff"} /></svg>
          {folder.name}
        </button>
      ))}
    </div>
  )
}