"use client"

import { useState, useEffect, useRef } from "react"

import { Header } from "./header"
import { MessageList } from "./message-list"
import { FileUploadForm } from "./file-upload-form"
import { useChat } from "@/app/hooks/use_chat"
import { DisplayMessage, InterruptState } from "@/types/chat"
import { AnalyseLCRequest } from "@/app/models/out"
import { convertFilesToBase64 } from "@/app/tools/tools"
import { removeFileAtIndex } from "@/types/file-utils"

export default function LCValidator() {
  const { events, isStreaming, isSending, error, sendMessage, clearError } = useChat(
    "http://localhost:8000/chat/analyse_lc_documents",
  )
  const [files, setFiles] = useState<FileList | undefined>(undefined)
  const [displayMessages, setDisplayMessages] = useState<DisplayMessage[]>([])
  const [currentInterrupt, setCurrentInterrupt] = useState<InterruptState>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const handleSubmit = async (submittedFiles: FileList) => {
    const userFiles = Array.from(submittedFiles).map((file) => ({
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
      const { images, documents } = await convertFilesToBase64(submittedFiles)

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

  const handleRemoveFile = (index: number) => {
    if (!files) return
    const newFiles = removeFileAtIndex(files, index)
    setFiles(newFiles)
    if (fileInputRef.current) {
      fileInputRef.current.files = newFiles || null
    }
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header isStreaming={isStreaming} />

      <MessageList
        messages={displayMessages}
        currentInterrupt={currentInterrupt}
        isStreaming={isStreaming}
        error={error}
        onInterruptResponse={handleInterruptResponse}
        onClearError={clearError}
      />

      <FileUploadForm
        files={files}
        isSending={isSending}
        isStreaming={isStreaming}
        onFilesChange={setFiles}
        onSubmit={handleSubmit}
        onRemoveFile={handleRemoveFile}
      />
    </div>
  )
}
