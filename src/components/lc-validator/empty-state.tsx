import { Shield, CheckCircle2 } from "lucide-react"
import { Card } from "@/components/ui/card"

export function EmptyState() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-20rem)]">
      <Card className="max-w-lg p-10 text-center border-2 border-dashed border-border">
        <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <Shield className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-2xl font-semibold mb-3 text-foreground">Upload Letter of Credit Documents</h2>
        <p className="text-muted-foreground leading-relaxed mb-6">
          Upload your LC documents for instant validation and compliance checking. Supported formats: PDF, JPG, PNG
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <CheckCircle2 className="h-4 w-4 text-accent" />
          <span>Bank-grade security</span>
        </div>
      </Card>
    </div>
  )
}
