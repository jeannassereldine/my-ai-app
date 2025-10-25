"use client"

import { Shield } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface InterruptPromptProps {
  question: string
  onResponse: (answer: "yes" | "no") => void
}

export function InterruptPrompt({ question, onResponse }: InterruptPromptProps) {
  return (
    <div className="flex gap-4 flex-row">
      <Avatar className="h-9 w-9 shrink-0">
        <AvatarFallback className="bg-muted">
          <Shield className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>

      <Card className="max-w-[80%] px-5 py-4 bg-card border-border shadow-sm">
        <p className="text-sm leading-relaxed mb-4">{question}</p>
        <div className="flex gap-3">
          <Button size="sm" onClick={() => onResponse("yes")} className="bg-primary hover:bg-primary/90">
            Yes
          </Button>
          <Button size="sm" variant="outline" onClick={() => onResponse("no")}>
            No
          </Button>
        </div>
      </Card>
    </div>
  )
}
