"use client"

import { InvitationResponse } from "@/types"

export default function InvitationsList({
  invitations,
  onAccept,
  onReject
}: {
  invitations: InvitationResponse[],
  onAccept: (invitationId: string) => void,
  onReject: (invitationId: string) => void
}) {
  return (
    <div className="flex flex-col gap-2 w-full">
      {invitations.length === 0 && <p className="text-center text-sm text-neutral-500">No invitations</p>}
      {invitations.map((invitation) => (
        <div key={invitation.id} className="flex items-center gap-2 w-full px-4 py-1 border rounded-md border-neutral-700 justify-between">
          <p><b>{invitation.creator.firstName} {invitation.creator.lastName}</b> invite you to join <b>{invitation.folder.name}</b></p>
          <div className="flex gap-2">
            <button onClick={() => onAccept(invitation.id)}>
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m8.5 16.586-3.793-3.793a1 1 0 0 0-1.414 1.414l4.5 4.5a1 1 0 0 0 1.414 0l11-11a1 1 0 0 0-1.414-1.414L8.5 16.586Z" fill="#ffffff" /></svg>
            </button>
            <button onClick={() => onReject(invitation.id)}>
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m4.21 4.387.083-.094a1 1 0 0 1 1.32-.083l.094.083L12 10.585l6.293-6.292a1 1 0 1 1 1.414 1.414L13.415 12l6.292 6.293a1 1 0 0 1 .083 1.32l-.083.094a1 1 0 0 1-1.32.083l-.094-.083L12 13.415l-6.293 6.292a1 1 0 0 1-1.414-1.414L10.585 12 4.293 5.707a1 1 0 0 1-.083-1.32l.083-.094-.083.094Z" fill="#ffffff" /></svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}