"use client"

import { useState, useEffect, useRef } from "react"
import type { FileSystem } from "@/lib/filesystem"
import type { CommandProcessor } from "@/lib/command-processor"
import { TerminalOutput } from "@/components/terminal-output"
import { TerminalInput } from "@/components/terminal-input"

interface TerminalProps {
  filesystem: FileSystem
  commandProcessor: CommandProcessor
  onImportHistory: () => Promise<string>
}

export function Terminal({ filesystem, commandProcessor, onImportHistory }: TerminalProps) {
  const [history, setHistory] = useState<Array<{ type: "input" | "output"; content: string }>>([
    { type: "output", content: "Welcome to ChatGPT Terminal v1.0.0" },
    { type: "output", content: 'Type "help" to see available commands.' },
  ])
  const [currentDirectory, setCurrentDirectory] = useState("/")
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Register custom commands
    commandProcessor.registerCommand("import", async () => {
      const result = await onImportHistory()
      return result
    })

    // Set up directory change listener
    commandProcessor.onDirectoryChange((newDir) => {
      setCurrentDirectory(newDir)
    })
  }, [commandProcessor, onImportHistory])

  useEffect(() => {
    // Scroll to bottom when history changes
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [history])

  const handleCommand = async (command: string) => {
    // Add command to history
    setHistory((prev) => [...prev, { type: "input", content: command }])

    // Add to command history for up/down navigation
    setCommandHistory((prev) => [...prev, command])
    setHistoryIndex(-1)

    if (command.trim() === "") {
      return
    }

    try {
      // Process the command
      const output = await commandProcessor.processCommand(command)

      // Add output to history
      setHistory((prev) => [...prev, { type: "output", content: output }])
    } catch (error) {
      // Add error to history
      setHistory((prev) => [...prev, { type: "output", content: `Error: ${error}` }])
    }
  }

  const handleHistoryNavigation = (direction: "up" | "down") => {
    if (commandHistory.length === 0) return ""

    let newIndex = historyIndex

    if (direction === "up") {
      newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1)
    } else {
      newIndex = historyIndex === -1 ? -1 : Math.min(commandHistory.length - 1, historyIndex + 1)
    }

    setHistoryIndex(newIndex)

    return newIndex === -1 ? "" : commandHistory[newIndex]
  }

  return (
    <div className="w-full h-[80vh] bg-black border border-green-500 rounded-md p-4 overflow-y-auto">
      <TerminalOutput history={history} />
      <div ref={bottomRef} />
      <TerminalInput
        currentDirectory={currentDirectory}
        onCommand={handleCommand}
        onHistoryNavigation={handleHistoryNavigation}
      />
    </div>
  )
}
