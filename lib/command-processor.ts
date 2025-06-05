import type { FileSystem } from "./filesystem"

type DirectoryChangeCallback = (newDir: string) => void

export class CommandProcessor {
  private fs: FileSystem
  private commands: Record<string, (args: string[]) => string | Promise<string>>
  private dirChangeCallbacks: DirectoryChangeCallback[] = []

  constructor(filesystem: FileSystem) {
    this.fs = filesystem
    this.commands = this.registerDefaultCommands()
  }

  public async processCommand(commandLine: string): Promise<string> {
    const [command, ...args] = commandLine.trim().split(/\s+/)

    if (!command) {
      return ""
    }

    const handler = this.commands[command]

    if (!handler) {
      return `Command not found: ${command}. Type 'help' for available commands.`
    }

    try {
      return await handler(args)
    } catch (error) {
      if (error instanceof Error) {
        return `Error: ${error.message}`
      }
      return "An unknown error occurred"
    }
  }

  public registerCommand(name: string, handler: (args: string[]) => string | Promise<string>): void {
    this.commands[name] = handler
  }

  public onDirectoryChange(callback: DirectoryChangeCallback): void {
    this.dirChangeCallbacks.push(callback)
  }

  private notifyDirectoryChange(newDir: string): void {
    for (const callback of this.dirChangeCallbacks) {
      callback(newDir)
    }
  }

  private registerDefaultCommands(): Record<string, (args: string[]) => string | Promise<string>> {
    return {
      help: () => this.handleHelp(),
      ls: (args) => this.handleLs(args),
      cd: (args) => this.handleCd(args),
      pwd: () => this.handlePwd(),
      mkdir: (args) => this.handleMkdir(args),
      rm: (args) => this.handleRm(args),
      cat: (args) => this.handleCat(args),
      touch: (args) => this.handleTouch(args),
      clear: () => this.handleClear(),
      echo: (args) => this.handleEcho(args),
      find: (args) => this.handleFind(args),
      open: (args) => this.handleOpen(args),
    }
  }

  // Command handlers
  private handleHelp(): string {
    return `
Available commands:
  help                 Show this help message
  ls [path]            List directory contents
  cd <path>            Change directory
  pwd                  Print working directory
  mkdir <path>         Create directory
  rm [-r] <path>       Remove file or directory
  cat <file>           Display file contents
  touch <file>         Create empty file
  clear                Clear the terminal
  echo <text>          Display text
  find <pattern>       Find files matching pattern
  open <file>          Open chat file in viewer
  import               Import ChatGPT history
`
  }

  private handleLs(args: string[]): string {
    try {
      const path = args[0] || ""
      const nodes = this.fs.ls(path)

      if (nodes.length === 0) {
        return "Directory is empty"
      }

      // Sort directories first, then files
      const sorted = [...nodes].sort((a, b) => {
        if (a.type === b.type) {
          return a.name.localeCompare(b.name)
        }
        return a.type === "directory" ? -1 : 1
      })

      const output = sorted.map((node) => {
        const color = node.type === "directory" ? "blue" : "green"
        const suffix = node.type === "directory" ? "/" : ""
        return `\x1b[${color === "blue" ? "34" : "32"}m${node.name}${suffix}\x1b[0m`
      })

      return output.join("\n")
    } catch (error) {
      if (error instanceof Error) {
        return `ls: ${error.message}`
      }
      return "ls: An unknown error occurred"
    }
  }

  private handleCd(args: string[]): string {
    if (args.length === 0) {
      return "cd: missing operand"
    }

    try {
      const newDir = this.fs.cd(args[0])
      this.notifyDirectoryChange(newDir)
      return ""
    } catch (error) {
      if (error instanceof Error) {
        return `cd: ${error.message}`
      }
      return "cd: An unknown error occurred"
    }
  }

  private handlePwd(): string {
    return this.fs.pwd()
  }

  private handleMkdir(args: string[]): string {
    if (args.length === 0) {
      return "mkdir: missing operand"
    }

    try {
      this.fs.mkdir(args[0])
      return ""
    } catch (error) {
      if (error instanceof Error) {
        return `mkdir: ${error.message}`
      }
      return "mkdir: An unknown error occurred"
    }
  }

  private handleRm(args: string[]): string {
    if (args.length === 0) {
      return "rm: missing operand"
    }

    try {
      const recursive = args[0] === "-r"
      const path = recursive ? args[1] : args[0]

      if (!path) {
        return "rm: missing operand"
      }

      this.fs.rm(path, recursive)
      return ""
    } catch (error) {
      if (error instanceof Error) {
        return `rm: ${error.message}`
      }
      return "rm: An unknown error occurred"
    }
  }

  private handleCat(args: string[]): string {
    if (args.length === 0) {
      return "cat: missing operand"
    }

    try {
      const content = this.fs.readFile(args[0])

      // If it's a chat file (JSON), try to format it nicely
      if (args[0].endsWith(".chat")) {
        try {
          const chatData = JSON.parse(content)

          if (chatData.title) {
            let output = `Title: ${chatData.title}\n\n`

            if (chatData.messages && Array.isArray(chatData.messages)) {
              output += chatData.messages
                .map((msg: any) => {
                  const role = msg.role === "user" ? "You" : "ChatGPT"
                  return `${role}: ${msg.content}`
                })
                .join("\n\n")
            }

            return output
          }
        } catch {
          // If JSON parsing fails, just return the raw content
        }
      }

      return content
    } catch (error) {
      if (error instanceof Error) {
        return `cat: ${error.message}`
      }
      return "cat: An unknown error occurred"
    }
  }

  private handleTouch(args: string[]): string {
    if (args.length === 0) {
      return "touch: missing operand"
    }

    try {
      this.fs.writeFile(args[0], "")
      return ""
    } catch (error) {
      if (error instanceof Error) {
        return `touch: ${error.message}`
      }
      return "touch: An unknown error occurred"
    }
  }

  private handleClear(): string {
    // Special case - clear is handled by the terminal component
    return "\x1b[clear]"
  }

  private handleEcho(args: string[]): string {
    return args.join(" ")
  }

  private handleFind(args: string[]): string {
    if (args.length === 0) {
      return "find: missing pattern"
    }

    const pattern = args[0]
    const results: string[] = []

    const searchDirectory = (path: string) => {
      try {
        const nodes = this.fs.ls(path)

        for (const node of nodes) {
          const nodePath = path === "/" ? `/${node.name}` : `${path}/${node.name}`

          if (node.name.includes(pattern)) {
            results.push(nodePath)
          }

          if (node.type === "directory") {
            searchDirectory(nodePath)
          }
        }
      } catch {
        // Skip directories we can't access
      }
    }

    searchDirectory("/")

    if (results.length === 0) {
      return `No files matching '${pattern}' found`
    }

    return results.join("\n")
  }

  private handleOpen(args: string[]): string {
    if (args.length === 0) {
      return "open: missing file"
    }

    try {
      const path = args[0]

      if (!path.endsWith(".chat")) {
        return "open: can only open .chat files"
      }

      const content = this.fs.readFile(path)

      try {
        const chatData = JSON.parse(content)

        // Format the chat for display
        let output = `\x1b[1m${chatData.title || "Untitled Chat"}\x1b[0m\n\n`

        if (chatData.messages && Array.isArray(chatData.messages)) {
          output += chatData.messages
            .map((msg: any) => {
              const role = msg.role === "user" ? "\x1b[34mYou\x1b[0m" : "\x1b[32mChatGPT\x1b[0m"
              return `${role}:\n${msg.content}`
            })
            .join("\n\n")
        }

        return output
      } catch {
        return "open: invalid chat file format"
      }
    } catch (error) {
      if (error instanceof Error) {
        return `open: ${error.message}`
      }
      return "open: An unknown error occurred"
    }
  }
}
