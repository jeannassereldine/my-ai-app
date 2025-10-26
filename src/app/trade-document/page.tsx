"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, FileText, Ship, DollarSign, Calendar, MapPin, ImageIcon, Loader2 } from "lucide-react"
import { useTradeDocuments } from "../hooks/use-trade-documents"
import { TradeDocument } from "../models/in"
import { TradeDocumentDetail } from "@/components/trade/trade-document-detail"


export default function TradeDocumentsPage() {
  const [selectedDocument, setSelectedDocument] = useState<TradeDocument | null>(null)
  const { documents, isLoading, error } = useTradeDocuments()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount)
  }

  if (selectedDocument) {
    return <TradeDocumentDetail document={selectedDocument} onBack={() => setSelectedDocument(null)} />
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Trade Documents</h1>
          <p className="text-muted-foreground mt-2">{"View and manage your Letter of Credit transactions"}</p>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
            <p className="font-medium">Error loading documents</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {!isLoading && !error && documents.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No trade documents found</p>
          </div>
        )}

        {!isLoading && !error && documents.length > 0 && (
          <div className="grid gap-4">
            {documents.map((doc) => (
              <Card
                key={doc.id}
                className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50"
                onClick={() => setSelectedDocument(doc)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        {doc.letter_of_credit.lc_number}
                      </CardTitle>
                      <CardDescription>
                        Invoice: {doc.commercial_invoice.invoice_number} • B/L: {doc.bill_of_lading.bl_number}
                      </CardDescription>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div className="flex items-start gap-3">
                      <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Amount</p>
                        <p className="text-lg font-bold">
                          {formatCurrency(doc.letter_of_credit.amount, doc.letter_of_credit.currency)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Expiry Date</p>
                        <p className="text-sm text-muted-foreground">{formatDate(doc.letter_of_credit.expiry_date)}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Ship className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Vessel</p>
                        <p className="text-sm text-muted-foreground">{doc.bill_of_lading.vessel_name}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Route</p>
                        <p className="text-sm text-muted-foreground">
                          {doc.letter_of_credit.port_of_loading} → {doc.letter_of_credit.port_of_discharge}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Goods</p>
                        <p className="text-sm text-muted-foreground">{doc.letter_of_credit.goods_description}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <ImageIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Attachments</p>
                        <p className="text-sm text-muted-foreground">
                          {doc.images.length > 0 ? `${doc.images.length} images` : "No images"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge variant="secondary">{doc.letter_of_credit.lc_type}</Badge>
                    <Badge variant="outline">{doc.letter_of_credit.incoterms}</Badge>
                    <Badge variant="outline">{doc.certificate_of_origin.origin_country}</Badge>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <div className="grid gap-2 text-sm md:grid-cols-2">
                      <div>
                        <span className="font-medium">Applicant:</span>{" "}
                        <span className="text-muted-foreground">{doc.letter_of_credit.applicant_name}</span>
                      </div>
                      <div>
                        <span className="font-medium">Beneficiary:</span>{" "}
                        <span className="text-muted-foreground">{doc.letter_of_credit.beneficiary_name}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
