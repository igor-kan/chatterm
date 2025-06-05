interface TerminalOutputProps {
  history: Array<{ type: "input" | "output"; content: string }>
}

export function TerminalOutput({ history }: TerminalOutputProps) {
  return (
    <div className="mb-4">
      {history.map((item, index) => (
        <div key={index} className="mb-1">
          {item.type === "input" ? (
            <div className="flex">
              <span className="text-blue-400">$ </span>
              <span className="ml-1">{item.content}</span>
            </div>
          ) : (
            <div className="whitespace-pre-wrap">{item.content}</div>
          )}
        </div>
      ))}
    </div>
  )
}
