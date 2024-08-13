"use client"

import { useState } from "react"
import InputField from "@/components/fields/InputField"
import TextAreaField from "@/components/fields/TextAreaField"
import PrimaryButton from "@/components/buttons/PrimaryButton"
import TertiaryButton from "@/components/buttons/TertiaryButton"
import SelectField from "@/components/fields/SelectField"
import { ElementResponse } from "@/types"
import { WithId } from "mongodb"

export default function ElementForm({
  folderId,
  onSuccess,
  onFailure,
  element,
  mode
}: {
  folderId: string,
  onSuccess?: () => void,
  onFailure?: (error: string) => void,
  element?: WithId<ElementResponse>,
  mode: "new" | "edit" | "view"
}) {
  const [urls, setUrls] = useState<string[]>([])
  const [customFields, setCustomFields] = useState<{ type: "visible" | "hidden" | "attachment", value: string }[]>([])
  const [isSensitive, setIsSensitive] = useState<boolean | undefined>(undefined)

  if ((mode === "edit" || mode === "view") && !element) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <p className="text-neutral-500">No element</p>
      </div>
    )
  }

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault()
        const form = event.currentTarget
        const formData = new FormData(form)
        const body = Object.fromEntries(formData.entries())
        const response = await fetch(`/api/elements?folderId=${folderId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(body)
        })
        if (response.ok) {
          form.reset()
          if (onSuccess) {
            onSuccess()
          }
        } else {
          const { error } = await response.json()
          if (onFailure) {
            onFailure(error)
          }
        }
      }}
      className="flex flex-col gap-2 w-full items-center"
    >
      <InputField
        type="text"
        label="Name"
        name="name"
        placeholder="Enter a name"
        required
        minLength={1}
        maxLength={32}
        value={element?.name}
        readOnly={mode === "view"}
      />
      <InputField
        type="text"
        label="Identifier"
        name="identifier"
        placeholder="Enter an identifier"
        minLength={1}
        maxLength={32}
        value={element?.identifier}
        readOnly={mode === "view"}
      />
      <InputField
        type="password"
        label="Password"
        name="password"
        placeholder="Enter a password"
        minLength={1}
        maxLength={32}
        value={element?.password}
        readOnly={mode === "view"}
      />
      <p className="w-full">URLs</p>
      {urls.map((url, index) => (
        <InputField
          key={index}
          type="text"
          name={`url-${index}`}
          placeholder="Enter a URL"
          minLength={1}
          maxLength={256}
          value={url}
          readOnly={mode === "view"}
        />
      ))}
      <TertiaryButton type="button" onClick={() => setUrls([...urls, ""])}>+ Add URL</TertiaryButton>
      <TextAreaField
        label="Note"
        name="note"
        placeholder="Enter a note"
        minLength={1}
        maxLength={4096}
        value={element?.note}
        readOnly={mode === "view"}
      />
      <p className="w-full">Custom fields</p>
      {customFields.map((customField, index) => (
        <>
          <SelectField
            key={index}
            name={`custom-field-select-${index}`}
            options={["Visible", "Hidden", "Attachment"]}
            optionSelected={customField.type}
            onChange={(value) => {
              const newCustomFields = [...customFields]
              newCustomFields[index].type = value === "Visible" ? "visible" : value === "Hidden" ? "hidden" : "attachment"
              newCustomFields[index].value = ""
              setCustomFields(newCustomFields)
            }}
          />
          {customField.type === "attachment" && (
            <InputField
              type="file"
              name={`custom-field-value-${index}`}
              onChange={(value) => { }}
            />
          )}
          {customField.type === "visible" && (
            <InputField
              type="text"
              name={`custom-field-value-${index}`}
              placeholder="Enter a value"
              minLength={1}
              maxLength={32}
              value={customField.value}
              onChange={(value) => {
                if (typeof value === "string") {
                  const newCustomFields = [...customFields]
                  newCustomFields[index].value = value
                  setCustomFields(newCustomFields)
                }
              }}
            />
          )}
          {customField.type === "hidden" && (
            <InputField
              type="password"
              name={`custom-field-value-${index}`}
              placeholder="Enter a value"
              minLength={1}
              maxLength={256}
              value={customField.value}
              onChange={(value) => {
                if (typeof value === "string") {
                  const newCustomFields = [...customFields]
                  newCustomFields[index].value = value
                  setCustomFields(newCustomFields)
                }
              }}
            />
          )}
        </>
      ))}
      <TertiaryButton
        type="button"
        onClick={() => setCustomFields([...customFields, { type: "visible", value: "" }])}>
        + Add custom field
      </TertiaryButton>
      <div className="flex flex-col gap-1 w-full">
        <label htmlFor="isSensitive">Is sensitive</label>
        <div className="flex gap-2">
          <input
            type="checkbox"
            name="isSensitive"
            onChange={(event) => setIsSensitive(event.currentTarget.checked)}
            checked={element?.isSensitive}
          />
          <p>{isSensitive ? "Oui" : "Non"}</p>
        </div>
      </div>
      <PrimaryButton type="submit">Save</PrimaryButton>
    </form>
  )
}