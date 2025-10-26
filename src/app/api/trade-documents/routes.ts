import { TradeDocument } from "@/app/models/in"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const backendUrl = process.env.BACKEND_API_URL || "http://localhost:8000"
    const response = await fetch(`${backendUrl}/valid_documents`)

    if (!response.ok) {
      throw new Error(`Backend API returned ${response.status}`)
    }

    const data: TradeDocument[] = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error("Failed to fetch trade documents:", error)
    return NextResponse.json({ error: "Failed to fetch trade documents from backend" }, { status: 500 })
  }
}
