"use client"

import { useState, useRef, useEffect, type KeyboardEvent } from "react"

interface TerminalInputProps {
  currentDirectory: string
  onCommand: (command: string) => void
  onHistoryNavigation: (direction: "up" | "down") => string
}

export function TerminalInput({ currentDirectory, onCommand, onHistoryNavigation }: TerminalInputProps) {
  const [input, setInput] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Focus input on mount
    inputRef.current?.focus()
  }, [])

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onCommand(input)
      setInput("")
    } else if (e.key === "ArrowUp") {
      const previousCommand = onHistoryNavigation("up")
      if (previousCommand !== "") {
        setInput(previousCommand)
      }
      // Prevent cursor from moving to start of input
      e.preventDefault()
    } else if (e.key === "ArrowDown") {
      const nextCommand = onHistoryNavigation("down")
      setInput(nextCommand)
      // Prevent cursor from moving to end of input
      e.preventDefault()
    } else if (e.key === "Tab") {
      // TODO: Implement tab completion
      e.preventDefault()
    }
  }

  // Keep focus on input when clicking anywhere in the terminal
  const handleContainerClick = () => {
    inputRef.current?.focus()
  }

  return (
    <div className="flex items-center" onClick={handleContainerClick}>
      <div className="flex text-yellow-400">
        <span>user@chatgpt:</span>
        <span className="text-blue-400 ml-1">{currentDirectory}</span>
        <span className="ml-1">$</span>
      </div>
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 ml-2 bg-transparent outline-none border-none text-green-500"
        autoFocus
      />
    </div>
  )
}
