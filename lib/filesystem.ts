// Simple in-memory filesystem implementation

export interface FileSystemNode {
  name: string
  type: "file" | "directory"
  content?: string
  children?: Record<string, FileSystemNode>
  metadata?: Record<string, any>
}

export class FileSystem {
  private root: FileSystemNode
  private currentDirectory: string

  constructor() {
    // Initialize root directory
    this.root = {
      name: "/",
      type: "directory",
      children: {},
    }

    this.currentDirectory = "/"

    // Create basic directory structure
    this.mkdir("/projects")
  }

  // Get the current working directory
  public pwd(): string {
    return this.currentDirectory
  }

  // Change directory
  public cd(path: string): string {
    const targetPath = this.resolvePath(path)
    const node = this.getNodeAtPath(targetPath)

    if (!node) {
      throw new Error(`Directory not found: ${path}`)
    }

    if (node.type !== "directory") {
      throw new Error(`Not a directory: ${path}`)
    }

    this.currentDirectory = targetPath
    return targetPath
  }

  // List directory contents
  public ls(path?: string): FileSystemNode[] {
    const targetPath = path ? this.resolvePath(path) : this.currentDirectory
    const node = this.getNodeAtPath(targetPath)

    if (!node) {
      throw new Error(`Directory not found: ${targetPath}`)
    }

    if (node.type !== "directory") {
      throw new Error(`Not a directory: ${targetPath}`)
    }

    if (!node.children) {
      return []
    }

    return Object.values(node.children)
  }

  // Create directory
  public mkdir(path: string): void {
    const parentPath = this.getParentPath(path)
    const dirName = this.getBaseName(path)

    if (!dirName) {
      throw new Error("Invalid directory name")
    }

    const parent = this.getNodeAtPath(parentPath)

    if (!parent) {
      throw new Error(`Parent directory not found: ${parentPath}`)
    }

    if (parent.type !== "directory") {
      throw new Error(`Not a directory: ${parentPath}`)
    }

    if (!parent.children) {
      parent.children = {}
    }

    if (parent.children[dirName]) {
      throw new Error(`Directory already exists: ${path}`)
    }

    parent.children[dirName] = {
      name: dirName,
      type: "directory",
      children: {},
    }
  }

  // Remove directory or file
  public rm(path: string, recursive = false): void {
    const targetPath = this.resolvePath(path)

    if (targetPath === "/") {
      throw new Error("Cannot remove root directory")
    }

    const parentPath = this.getParentPath(targetPath)
    const baseName = this.getBaseName(targetPath)
    const parent = this.getNodeAtPath(parentPath)

    if (!parent || !parent.children || !parent.children[baseName]) {
      throw new Error(`File or directory not found: ${path}`)
    }

    const node = parent.children[baseName]

    if (node.type === "directory" && node.children && Object.keys(node.children).length > 0 && !recursive) {
      throw new Error(`Directory not empty: ${path}. Use -r flag to remove recursively.`)
    }

    delete parent.children[baseName]
  }

  // Create or update file
  public writeFile(path: string, content: string): void {
    const parentPath = this.getParentPath(path)
    const fileName = this.getBaseName(path)

    if (!fileName) {
      throw new Error("Invalid file name")
    }

    const parent = this.getNodeAtPath(parentPath)

    if (!parent) {
      throw new Error(`Parent directory not found: ${parentPath}`)
    }

    if (parent.type !== "directory") {
      throw new Error(`Not a directory: ${parentPath}`)
    }

    if (!parent.children) {
      parent.children = {}
    }

    parent.children[fileName] = {
      name: fileName,
      type: "file",
      content,
    }
  }

  // Read file content
  public readFile(path: string): string {
    const targetPath = this.resolvePath(path)
    const node = this.getNodeAtPath(targetPath)

    if (!node) {
      throw new Error(`File not found: ${path}`)
    }

    if (node.type !== "file") {
      throw new Error(`Not a file: ${path}`)
    }

    return node.content || ""
  }

  // Check if path exists
  public exists(path: string): boolean {
    const targetPath = this.resolvePath(path)
    return this.getNodeAtPath(targetPath) !== null
  }

  // Save filesystem to localStorage
  public async saveToStorage(): Promise<void> {
    try {
      localStorage.setItem("chatgpt-terminal-fs", JSON.stringify(this.root))
    } catch (error) {
      console.error("Failed to save filesystem to storage:", error)
      throw error
    }
  }

  // Load filesystem from localStorage
  public async loadFromStorage(): Promise<void> {
    try {
      const data = localStorage.getItem("chatgpt-terminal-fs")

      if (data) {
        this.root = JSON.parse(data)
      }
    } catch (error) {
      console.error("Failed to load filesystem from storage:", error)
      throw error
    }
  }

  // Helper methods
  private resolvePath(path: string): string {
    if (!path) {
      return this.currentDirectory
    }

    // Handle absolute paths
    if (path.startsWith("/")) {
      return this.normalizePath(path)
    }

    // Handle relative paths
    return this.normalizePath(`${this.currentDirectory}/${path}`)
  }

  private normalizePath(path: string): string {
    const parts = path.split("/").filter(Boolean)
    const result: string[] = []

    for (const part of parts) {
      if (part === ".") {
        continue
      } else if (part === "..") {
        result.pop()
      } else {
        result.push(part)
      }
    }

    return `/${result.join("/")}`
  }

  private getNodeAtPath(path: string): FileSystemNode | null {
    if (path === "/") {
      return this.root
    }

    const parts = path.split("/").filter(Boolean)
    let current: FileSystemNode = this.root

    for (const part of parts) {
      if (!current.children || !current.children[part]) {
        return null
      }

      current = current.children[part]
    }

    return current
  }

  private getParentPath(path: string): string {
    const normalized = this.normalizePath(path)
    const lastSlashIndex = normalized.lastIndexOf("/")

    if (lastSlashIndex <= 0) {
      return "/"
    }

    return normalized.substring(0, lastSlashIndex)
  }

  private getBaseName(path: string): string {
    const normalized = this.normalizePath(path)
    const lastSlashIndex = normalized.lastIndexOf("/")

    if (lastSlashIndex === normalized.length - 1) {
      return ""
    }

    return normalized.substring(lastSlashIndex + 1)
  }
}
