"use client"

import { useCallback, useEffect, useState } from "react"

export default function PasswordGenerator({
  minLength = 1,
  maxLength = 32,
  defaultLength = 16,
  defaultMinUppercase = 0,
  defaultMinLowercase = 0,
  defaultMinDigits = 0,
  defaultMinSymbols = 0,
  defaultCharsToExclude = "IlO0S5",
  alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  digits = "0123456789",
  symbols = "!@#$%^&*()_+-=[]{}|;:,.<>/?"
}: {
  minLength?: number,
  maxLength?: number,
  defaultLength?: number,
  defaultMinUppercase?: number,
  defaultMinLowercase?: number,
  defaultMinDigits?: number,
  defaultMinSymbols?: number,
  defaultCharsToExclude?: string,
  alphabet?: string,
  digits?: string,
  symbols?: string
}) {
  const [length, setLength] = useState<number>(defaultLength)
  const [minUppercase, setMinUppercase] = useState<number>(defaultMinUppercase)
  const [minLowercase, setMinLowercase] = useState<number>(defaultMinLowercase)
  const [minDigits, setMinDigits] = useState<number>(defaultMinDigits)
  const [minSymbols, setMinSpecialChars] = useState<number>(defaultMinSymbols)
  const [charsToExclude, setCharsToExclude] = useState<string>(defaultCharsToExclude)
  const [password, setPassword] = useState<string>("")

  function setValue(
    key: "length" | "minUppercase" | "minLowercase" | "minDigits" | "minSymbols",
    value: number
  ) {
    const total = minUppercase + minLowercase + minDigits + minSymbols

    if (key === "length") {
      if (value < total) {
        const excess = total - value

        const adjustments = {
          minUppercase: minUppercase,
          minLowercase: minLowercase,
          minDigits: minDigits,
          minSymbols: minSymbols
        }

        const keys = Object.keys(adjustments).sort((a, b) => adjustments[b as keyof typeof adjustments] - adjustments[a as keyof typeof adjustments])

        let remainingExcess = excess

        for (const k of keys) {
          if (remainingExcess === 0) break

          const currentValue = adjustments[k as keyof typeof adjustments]

          if (currentValue > 0) {
            const reduceBy = Math.min(currentValue, remainingExcess)
            adjustments[k as keyof typeof adjustments] -= reduceBy
            remainingExcess -= reduceBy
          }
        }

        setMinUppercase(adjustments.minUppercase)
        setMinLowercase(adjustments.minLowercase)
        setMinDigits(adjustments.minDigits)
        setMinSpecialChars(adjustments.minSymbols)
      }

      setLength(value)
    } else if (total + value - eval(key) > length) {
      const excess = total + value - eval(key) - length

      const adjustments = {
        minUppercase: minUppercase,
        minLowercase: minLowercase,
        minDigits: minDigits,
        minSymbols: minSymbols
      }

      const keys = Object.keys(adjustments).filter(k => k !== key).sort((a, b) => adjustments[b as keyof typeof adjustments] - adjustments[a as keyof typeof adjustments])

      let remainingExcess = excess

      for (const k of keys) {
        if (remainingExcess === 0) break

        const currentValue = adjustments[k as keyof typeof adjustments]

        if (currentValue > 0) {
          const reduceBy = Math.min(currentValue, remainingExcess)
          adjustments[k as keyof typeof adjustments] -= reduceBy
          remainingExcess -= reduceBy
        }
      }

      setMinUppercase(adjustments.minUppercase)
      setMinLowercase(adjustments.minLowercase)
      setMinDigits(adjustments.minDigits)
      setMinSpecialChars(adjustments.minSymbols)
    }

    switch (key) {
      case "minUppercase":
        setMinUppercase(value)
        break
      case "minLowercase":
        setMinLowercase(value)
        break
      case "minDigits":
        setMinDigits(value)
        break
      case "minSymbols":
        setMinSpecialChars(value)
        break
      case "length":
        setLength(value)
        break
      default:
        break
    }
  }

  const generatePassword = useCallback(() => {
    let availableUpperCase = alphabet.toUpperCase()
    let availableLowerCase = alphabet.toLowerCase()
    let availableDigits = digits
    let availableSymbols = symbols
    let allChars = availableUpperCase + availableLowerCase + availableDigits + availableSymbols

    if (charsToExclude) {
      const excludeSet = new Set(charsToExclude.split(""))
      availableUpperCase = availableUpperCase.split("").filter(char => !excludeSet.has(char)).join("")
      availableLowerCase = availableLowerCase.split("").filter(char => !excludeSet.has(char)).join("")
      availableDigits = availableDigits.split("").filter(char => !excludeSet.has(char)).join("")
      availableSymbols = availableSymbols.split("").filter(char => !excludeSet.has(char)).join("")
      allChars = allChars.split("").filter(char => !excludeSet.has(char)).join("")

      if (!availableUpperCase && !availableLowerCase && !availableDigits && !availableSymbols) {
        return setPassword("")
      }
    }

    const generateChars = (count: number, charSet: string) => {
      let result = ""
      if (charSet.length === 0) return result
      for (let i = 0; i < count; i++) {
        result += charSet[Math.floor(Math.random() * charSet.length)]
      }
      return result
    }

    let password =
      generateChars(minUppercase, availableUpperCase) +
      generateChars(minLowercase, availableLowerCase) +
      generateChars(minDigits, availableDigits) +
      generateChars(minSymbols, availableSymbols)

    if (allChars.length > 0) {
      password += generateChars(length - password.length, allChars)
    }

    password = password.split("").sort(() => Math.random() - 0.5).join("")

    setPassword(password)
  }, [alphabet, charsToExclude, digits, length, minDigits, minLowercase, minSymbols, minUppercase, symbols])

  useEffect(() => {
    generatePassword()
  }, [generatePassword])


  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 items-center">
        <div className="flex items-center relative">
          <input
            className="py-1 px-2 rounded border border-neutral-700 bg-transparent w-96"
            type="text"
            value={password}
          />
          <button
            className="absolute right-2"
            onClick={async () => await navigator.clipboard.writeText(password)}
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5.503 4.627 5.5 6.75v10.504a3.25 3.25 0 0 0 3.25 3.25h8.616a2.251 2.251 0 0 1-2.122 1.5H8.75A4.75 4.75 0 0 1 4 17.254V6.75c0-.98.627-1.815 1.503-2.123ZM17.75 2A2.25 2.25 0 0 1 20 4.25v13a2.25 2.25 0 0 1-2.25 2.25h-9a2.25 2.25 0 0 1-2.25-2.25v-13A2.25 2.25 0 0 1 8.75 2h9Z" fill="#404040" /></svg>
          </button>
        </div>
        <button onClick={() => generatePassword()}>
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M16.052 5.029a1 1 0 0 0 .189 1.401 7.002 7.002 0 0 1-3.157 12.487l.709-.71a1 1 0 0 0-1.414-1.414l-2.5 2.5a1 1 0 0 0 0 1.414l2.5 2.5a1 1 0 0 0 1.414-1.414l-.843-.842A9.001 9.001 0 0 0 17.453 4.84a1 1 0 0 0-1.401.189Zm-1.93-1.736-2.5-2.5a1 1 0 0 0-1.498 1.32l.083.094.843.843a9.001 9.001 0 0 0-4.778 15.892A1 1 0 0 0 7.545 17.4a7.002 7.002 0 0 1 3.37-12.316l-.708.709a1 1 0 0 0 1.32 1.497l.094-.083 2.5-2.5a1 1 0 0 0 .083-1.32l-.083-.094Z" fill="#ffffff" /></svg>
        </button>
      </div>
      <div className="flex flex-col gap-2">
        <label>Length : {length}</label>
        <input
          type="range"
          min={minLength}
          max={maxLength}
          step={1}
          value={length}
          onChange={e => setValue("length", parseInt(e.target.value))}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label>Minimum uppercase : {minUppercase}</label>
        <input
          type="range"
          min={0}
          max={length}
          step={1}
          value={minUppercase}
          onChange={e => setValue("minUppercase", parseInt(e.target.value))}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label>Minimum lowercase : {minLowercase}</label>
        <input
          type="range"
          min={0}
          max={length}
          step={1}
          value={minLowercase}
          onChange={e => setValue("minLowercase", parseInt(e.target.value))}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label>Minimum digits : {minDigits}</label>
        <input
          type="range"
          min={0}
          max={length}
          step={1}
          value={minDigits}
          onChange={e => setValue("minDigits", parseInt(e.target.value))}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label>Minimum symbols : {minSymbols}</label>
        <input
          type="range"
          min={0}
          max={length}
          step={1}
          value={minSymbols}
          onChange={e => setValue("minSymbols", parseInt(e.target.value))}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label>Characters to exclude</label>
        <input
          className="py-1 px-2 rounded border border-neutral-700 bg-transparent w-96"
          type="text"
          value={charsToExclude}
          onChange={e => setCharsToExclude(e.target.value)}
        />
      </div>
    </div>
  )
}