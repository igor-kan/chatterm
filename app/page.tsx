"use client"

import { useEffect, useState, useRef } from "react"
import { Terminal } from "@/components/terminal"
import { FileSystem } from "@/lib/filesystem"
import { CommandProcessor } from "@/lib/command-processor"
import { fetchChatGPTHistory } from "@/lib/chatgpt-api"

export default function Home() {
  const [initialized, setInitialized] = useState(false)
  const fsRef = useRef<FileSystem | null>(null)
  const commandProcessorRef = useRef<CommandProcessor | null>(null)

  useEffect(() => {
    const initializeApp = async () => {
      // Create filesystem instance
      const fs = new FileSystem()
      fsRef.current = fs

      try {
        // Try to load data from storage
        await fs.loadFromStorage()
      } catch (error) {
        console.error("Failed to load from storage:", error)
        // Initialize with demo data if loading fails
        await initializeDemoData(fs)
      }

      // Create command processor
      commandProcessorRef.current = new CommandProcessor(fs)
      setInitialized(true)
    }

    initializeApp()
  }, [])

  const initializeDemoData = async (fs: FileSystem) => {
    // Create some demo directories and files
    fs.mkdir("/projects")
    fs.mkdir("/projects/web-development")
    fs.mkdir("/projects/ai-research")

    fs.writeFile(
      "/projects/web-development/nextjs-app.chat",
      JSON.stringify({
        title: "Next.js Application",
        messages: [
          { role: "user", content: "How do I create a Next.js app?" },
          { role: "assistant", content: "You can use create-next-app to start a new Next.js project..." },
        ],
      }),
    )

    fs.writeFile(
      "/projects/ai-research/llm-models.chat",
      JSON.stringify({
        title: "LLM Models Discussion",
        messages: [
          { role: "user", content: "What are the latest LLM models?" },
          { role: "assistant", content: "The latest models include GPT-4o, Claude 3, and..." },
        ],
      }),
    )

    // Save to storage
    await fs.saveToStorage()
  }

  const handleImportHistory = async () => {
    if (!fsRef.current) return

    try {
      const history = await fetchChatGPTHistory()

      // Process and organize the history into the filesystem
      history.forEach((conversation, index) => {
        const projectName = conversation.project || "unsorted"
        const path = `/projects/${projectName}`

        // Create project directory if it doesn't exist
        if (!fsRef.current?.exists(path)) {
          fsRef.current?.mkdir(path)
        }

        // Create chat file
        const fileName = `${conversation.title || `chat-${index}`}.chat`
        fsRef.current?.writeFile(`${path}/${fileName}`, JSON.stringify(conversation))
      })

      // Save to storage
      await fsRef.current.saveToStorage()

      return `Imported ${history.length} conversations`
    } catch (error) {
      console.error("Failed to import history:", error)
      return "Failed to import history. Make sure you're logged into ChatGPT and the extension has permissions."
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 bg-black text-green-500 font-mono">
      <div className="w-full max-w-5xl">
        <h1 className="text-xl mb-4">ChatGPT Terminal</h1>
        {initialized && fsRef.current && commandProcessorRef.current ? (
          <Terminal
            filesystem={fsRef.current}
            commandProcessor={commandProcessorRef.current}
            onImportHistory={handleImportHistory}
          />
        ) : (
          <div className="animate-pulse">Initializing filesystem...</div>
        )}
      </div>
    </main>
  )
}
