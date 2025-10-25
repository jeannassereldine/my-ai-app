export type DisplayMessage = {
  id: string
  role: "user" | "assistant"
  content: string
  files?: { name: string; type: string; url: string }[]
}

export type InterruptState = {
  question: string
  interruptId: string
} | null
