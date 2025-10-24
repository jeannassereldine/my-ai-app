"use client"

import type React from "react"
import { useChat } from "./hooks/use_chat"
import { useRef, useState, useEffect } from "react"
import { Upload, X, FileText, AlertCircle, Shield, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { AnalyseLCRequest } from "./models/out"
import { convertFilesToBase64 } from "./tools/tools"

type DisplayMessage = {
  id: string
  role: "user" | "assistant"
  content: string
  files?: { name: string; type: string; url: string }[]
}

export default function LCValidator() {
  const { events, isStreaming, isSending, error, sendMessage, clearError } = useChat(
    "http://localhost:8000/chat/analyse_lc_documents",
  )
  const [files, setFiles] = useState<FileList | undefined>(undefined)
  const [displayMessages, setDisplayMessages] = useState<DisplayMessage[]>([])
  const [currentInterrupt, setCurrentInterrupt] = useState<{
    question: string
    interruptId: string
  } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [displayMessages, currentInterrupt])

  useEffect(() => {
    let assistantMessageContent = ""

    events.forEach((event) => {
      if (event.event === "message") {
        assistantMessageContent += event.payload
      } else if (event.event === "interrupt") {
        setCurrentInterrupt({
          question: event.payload.question,
          interruptId: event.payload.interruptId,
        })
      } else if (event.event === "done") {
        if (assistantMessageContent) {
          setDisplayMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              role: "assistant",
              content: assistantMessageContent,
            },
          ])
          assistantMessageContent = ""
        }
      }
    })

    if (assistantMessageContent && isStreaming) {
      setDisplayMessages((prev) => {
        const lastMessage = prev[prev.length - 1]
        if (lastMessage?.role === "assistant") {
          return [...prev.slice(0, -1), { ...lastMessage, content: assistantMessageContent }]
        }
        return [
          ...prev,
          {
            id: Date.now().toString(),
            role: "assistant",
            content: assistantMessageContent,
          },
        ]
      })
    }
  }, [events, isStreaming])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!files || files.length === 0) return

    const userFiles = Array.from(files).map((file) => ({
      name: file.name,
      type: file.type,
      url: URL.createObjectURL(file),
    }))

    setDisplayMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: "user",
        content: "Letter of Credit documents uploaded for validation",
        files: userFiles,
      },
    ])

    try {
      const { images, documents } = await convertFilesToBase64(files)

      const request: AnalyseLCRequest = {
        images,
        documents,
      }

      await sendMessage(request)
    } catch (err) {
      console.error("Failed to send message:", err)
    }
    setFiles(undefined)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleInterruptResponse = async (answer: "yes" | "no") => {
    if (!currentInterrupt) return

    setDisplayMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: "assistant",
        content: currentInterrupt.question,
      },
      {
        id: (Date.now() + 1).toString(),
        role: "user",
        content: answer === "yes" ? "Yes" : "No",
      },
    ])

    setCurrentInterrupt(null)
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
      <header className="border-b bg-card shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 bg-primary">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Shield className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Letter of Credit Validator</h1>
                <p className="text-sm text-muted-foreground">
                  {isStreaming ? "Analyzing documents..." : "Secure document validation"}
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Secure
            </Badge>
          </div>
        </div>
      </header>

      <ScrollArea className="flex-1">
        <div className="max-w-5xl mx-auto px-4 py-8">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>{error}</span>
                <Button variant="ghost" size="sm" onClick={clearError}>
                  Dismiss
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {displayMessages.length === 0 && !isStreaming && (
            <div className="flex items-center justify-center min-h-[calc(100vh-20rem)]">
              <Card className="max-w-lg p-10 text-center border-2 border-dashed border-border">
                <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <Shield className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold mb-3 text-foreground">Upload Letter of Credit Documents</h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Upload your LC documents for instant validation and compliance checking. Supported formats: PDF, JPG,
                  PNG
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                  <span>Bank-grade security</span>
                </div>
              </Card>
            </div>
          )}

          <div className="space-y-6">
            {displayMessages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarFallback
                    className={message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}
                  >
                    {message.role === "user" ? <Upload className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>

                <Card
                  className={`max-w-[80%] px-5 py-4 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-card border-border shadow-sm"
                  }`}
                >
                  <div className="space-y-3">
                    {message.content && (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    )}

                    {message.files && message.files.length > 0 && (
                      <div className="space-y-3 mt-3">
                        {message.files.map((file, index) => {
                          const isImage = file.type.startsWith("image/")

                          if (isImage) {
                            return (
                              <div key={index} className="space-y-2">
                                <img
                                  src={file.url || "/placeholder.svg"}
                                  alt={file.name}
                                  className="max-w-full h-auto rounded-lg border-2 border-border/50"
                                />
                                <p className="text-xs opacity-80">{file.name}</p>
                              </div>
                            )
                          }

                          return (
                            <div
                              key={index}
                              className={`flex items-center gap-3 p-3 rounded-lg border ${
                                message.role === "user"
                                  ? "border-primary-foreground/20 bg-primary-foreground/10"
                                  : "border-border bg-muted/50"
                              }`}
                            >
                              <FileText className="h-5 w-5 shrink-0" />
                              <span className="text-sm flex-1 truncate font-medium">{file.name}</span>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            ))}

            {currentInterrupt && (
              <div className="flex gap-4 flex-row">
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarFallback className="bg-muted">
                    <Shield className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>

                <Card className="max-w-[80%] px-5 py-4 bg-card border-border shadow-sm">
                  <p className="text-sm leading-relaxed mb-4">{currentInterrupt.question}</p>
                  <div className="flex gap-3">
                    <Button
                      size="sm"
                      onClick={() => handleInterruptResponse("yes")}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Yes
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleInterruptResponse("no")}>
                      No
                    </Button>
                  </div>
                </Card>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="border-t bg-card shadow-lg">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {files && files.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {Array.from(files).map((file, index) => (
                  <Badge key={index} variant="secondary" className="gap-2 pr-1.5 py-2 text-sm">
                    <FileText className="h-3.5 w-3.5" />
                    <span className="max-w-[250px] truncate">{file.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 rounded-full hover:bg-background/80"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex items-center gap-3">
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,image/jpeg,image/png,application/pdf"
                ref={fileInputRef}
                onChange={(event) => {
                  if (event.target.files) {
                    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"]
                    const allowedExtensions = [".pdf", ".jpg", ".jpeg", ".png"]

                    const validFiles = Array.from(event.target.files).filter((file) => {
                      const isValidType = allowedTypes.includes(file.type)
                      const hasValidExtension = allowedExtensions.some((ext) => file.name.toLowerCase().endsWith(ext))

                      if (!isValidType && !hasValidExtension) {
                        console.warn(`File "${file.name}" is not a valid PDF, JPG, or PNG`)
                        return false
                      }
                      return true
                    })

                    if (validFiles.length > 0) {
                      const dataTransfer = new DataTransfer()
                      validFiles.forEach((file) => dataTransfer.items.add(file))
                      setFiles(dataTransfer.files)
                    } else {
                      alert("Please select only PDF, JPG, or PNG files")
                    }
                  }
                }}
                multiple
                className="hidden"
                id="file-upload"
              />

              <Button
                type="button"
                variant="outline"
                className="flex-1 h-14 border-2 border-dashed hover:border-primary hover:bg-primary/5 transition-colors bg-transparent"
                asChild
              >
                <label htmlFor="file-upload" className="cursor-pointer flex items-center justify-center gap-3">
                  <Upload className="h-5 w-5" />
                  <span className="font-medium">
                    {files && files.length > 0 ? "Add More Documents" : "Upload LC Documents"}
                  </span>
                </label>
              </Button>

              <Button
                type="submit"
                size="lg"
                className="h-14 px-8 bg-primary hover:bg-primary/90 shadow-sm"
                disabled={!files || files.length === 0 || isSending || isStreaming}
              >
                <span className="font-semibold">Validate Documents</span>
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              Supported formats: PDF, JPG, PNG • Maximum file size: 10MB per file
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
