import { Shield, CheckCircle2 } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface HeaderProps {
  isStreaming: boolean
}

export function Header({ isStreaming }: HeaderProps) {
  return (
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
  )
}
