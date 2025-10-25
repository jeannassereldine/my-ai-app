import { Upload, Shield, FileText } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import type { DisplayMessage } from "@/types/chat"

interface MessageItemProps {
  message: DisplayMessage
}

export function MessageItem({ message }: MessageItemProps) {
  return (
    <div className={`flex gap-4 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
      <Avatar className="h-9 w-9 shrink-0">
        <AvatarFallback className={message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}>
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
          {message.content && <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>}

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
  )
}
