"use client"

import type React from "react"
import { useChat } from "@ai-sdk/react"
import { useRef, useState, useEffect } from "react"
import { Paperclip, Send, X, Bot, User, FileText, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

async function convertFilesToDataURLs(
  files: FileList,
): Promise<{ type: "file"; filename: string; mediaType: string; url: string }[]> {
  return Promise.all(
    Array.from(files).map(
      (file) =>
        new Promise<{
          type: "file"
          filename: string
          mediaType: string
          url: string
        }>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => {
            resolve({
              type: "file",
              filename: file.name,
              mediaType: file.type,
              url: reader.result as string,
            })
          }
          reader.onerror = reject
          reader.readAsDataURL(file)
        }),
    ),
  )
}

export default function Chat() {
  const [input, setInput] = useState("")
  const { messages, sendMessage } = useChat()
  const [files, setFiles] = useState<FileList | undefined>(undefined)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!input.trim() && (!files || files.length === 0)) return

    const fileParts = files && files.length > 0 ? await convertFilesToDataURLs(files) : []

    sendMessage({
      role: "user",
      parts: [{ type: "text", text: input }, ...fileParts],
    })

    setFiles(undefined)
    setInput("")

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const removeFile = (index: number) => {
    if (!files) return
    const dt = new DataTransfer()
    Array.from(files).forEach((file, i) => {
      if (i !== index) dt.items.add(file)
    })
    setFiles(dt.files.length > 0 ? dt.files : undefined)
    if (fileInputRef.current) {
      fileInputRef.current.files = dt.files
    }
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary text-primary-foreground">
                <Bot className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-lg font-semibold">AI Assistant</h1>
              <p className="text-xs text-muted-foreground">Always here to help</p>
            </div>
          </div>
        </div>
      </header>

      <ScrollArea className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {messages.length === 0 && (
            <div className="flex items-center justify-center min-h-[calc(100vh-16rem)]">
              <Card className="max-w-md p-8 text-center border-dashed">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Bot className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Start a conversation</h2>
                <p className="text-sm text-muted-foreground">
                  Send a message or attach files to begin chatting with your AI assistant
                </p>
              </Card>
            </div>
          )}

          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className={message.role === "user" ? "bg-primary text-primary-foreground" : ""}>
                    {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>

                <Card
                  className={`max-w-[75%] px-4 py-3 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted border-muted"
                  }`}
                >
                  <div className="space-y-2">
                    {message.parts.map((part, index) => {
                      if (part.type === "text") {
                        return (
                          <p
                            key={`${message.id}-text-${index}`}
                            className="text-sm leading-relaxed whitespace-pre-wrap"
                          >
                            {part.text}
                          </p>
                        )
                      }

                      if (part.type === "file") {
                        const isImage = part.mediaType?.startsWith("image/")

                        if (isImage) {
                          return (
                            <div key={`${message.id}-file-${index}`} className="mt-2">
                              <img
                                src={part.url || "/placeholder.svg"}
                                alt={part.filename}
                                className="max-w-full h-auto rounded-md border border-border/50"
                              />
                              <p className="text-xs mt-1 opacity-70">{part.filename}</p>
                            </div>
                          )
                        }

                        return (
                          <a
                            key={`${message.id}-file-${index}`}
                            href={part.url}
                            download={part.filename}
                            className={`flex items-center gap-2 mt-2 p-2 rounded border ${
                              message.role === "user"
                                ? "border-primary-foreground/20 hover:bg-primary-foreground/10"
                                : "border-border hover:bg-background/50"
                            } transition-colors`}
                          >
                            <FileText className="h-4 w-4 shrink-0" />
                            <span className="text-xs flex-1 truncate">{part.filename}</span>
                            <Download className="h-3 w-3 shrink-0" />
                          </a>
                        )
                      }

                      return null
                    })}
                  </div>
                </Card>
              </div>
            ))}
          </div>
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="border-t bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            {files && files.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {Array.from(files).map((file, index) => (
                  <Badge key={index} variant="secondary" className="gap-2 pr-1 py-1.5">
                    <Paperclip className="h-3 w-3" />
                    <span className="max-w-[200px] truncate">{file.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 rounded-full hover:bg-background/80"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex items-end gap-2">
              <div className="flex-1 relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSubmit(e)
                    }
                  }}
                  placeholder="Type your message..."
                  className="w-full resize-none rounded-lg bg-background border px-4 py-3 pr-12 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[52px] max-h-[200px]"
                  rows={1}
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(event) => {
                    if (event.target.files) {
                      setFiles(event.target.files)
                    }
                  }}
                  multiple
                  className="hidden"
                  id="file-upload"
                />
                <Button type="button" variant="ghost" size="icon" className="absolute right-2 bottom-2 h-8 w-8" asChild>
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Paperclip className="h-4 w-4" />
                  </label>
                </Button>
              </div>

              <Button
                type="submit"
                size="icon"
                className="h-[52px] w-[52px] shrink-0"
                disabled={!input.trim() && (!files || files.length === 0)}
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
