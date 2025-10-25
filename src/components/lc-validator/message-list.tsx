"use client"

import { useRef, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MessageItem } from "./message-item"
import { InterruptPrompt } from "./interrupt-prompt"
import { EmptyState } from "./empty-state"
import { DisplayMessage, InterruptState } from "@/types/chat"


interface MessageListProps {
  messages: DisplayMessage[]
  currentInterrupt: InterruptState
  isStreaming: boolean
  error: string | null
  onInterruptResponse: (answer: "yes" | "no") => void
  onClearError: () => void
}

export function MessageList({
  messages,
  currentInterrupt,
  isStreaming,
  error,
  onInterruptResponse,
  onClearError,
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, currentInterrupt])

  return (
    <ScrollArea className="flex-1">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <Button variant="ghost" size="sm" onClick={onClearError}>
                Dismiss
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {messages.length === 0 && !isStreaming && <EmptyState />}

        <div className="space-y-6">
          {messages.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))}

          {currentInterrupt && (
            <InterruptPrompt question={currentInterrupt.question} onResponse={onInterruptResponse} />
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  )
}
