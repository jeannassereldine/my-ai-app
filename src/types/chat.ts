export type DisplayMessage = {
  id: string
  role: "user" | "assistant"
  content: string
  files?: { name: string; type: string; url: string }[]
}

export type InterruptState = {
  question: string
  interrupt_id: string
  thread_id:string
} | null
