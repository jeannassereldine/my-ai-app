"use client"

import { useState, useEffect } from "react"
import { TradeDocument } from "../models/in"


export function useTradeDocuments() {
  const [documents, setDocuments] = useState<TradeDocument[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setIsLoading(true)
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:8000"
        const response = await fetch(`${backendUrl}/documents/trade_documents`)

        if (!response.ok) {
          throw new Error("Failed to fetch documents")
        }

        const data = await response.json()
        setDocuments(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDocuments()
  }, [])

  return { documents, isLoading, error }
}
