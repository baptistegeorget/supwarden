"use client"

import { ButtonHTMLAttributes, ReactNode } from "react"

export default function SecondaryButton({
  children,
  onClick,
  type
}: {
  children?: ReactNode,
  onClick?: () => void,
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"]
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="bg-black text-white px-4 py-1 rounded-md shadow-lg flex items-center gap-2 border border-neutral-700"
    >
      {children}
    </button>
  )
}