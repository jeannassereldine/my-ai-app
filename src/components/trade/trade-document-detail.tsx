"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, FileText, Ship, DollarSign, Calendar, Package, Building2 } from "lucide-react"
import type { TradeDocument } from "@/app/models/in"
import { ImageLightbox } from "./image-lightbox"


interface TradeDocumentDetailProps {
  document: TradeDocument
  onBack: () => void
}

export function TradeDocumentDetail({ document, onBack }: TradeDocumentDetailProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const apiUri = process.env.NEXT_PUBLIC_API_URI

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount)
  }

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index)
    setLightboxOpen(true)
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to List
        </Button>

        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <FileText className="h-8 w-8" />
            {document.letter_of_credit.lc_number}
          </h1>
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge variant="secondary">{document.letter_of_credit.lc_type}</Badge>
            <Badge variant="outline">{document.letter_of_credit.incoterms}</Badge>
            <Badge variant="outline">{document.certificate_of_origin.origin_country}</Badge>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="letter-of-credit">Letter of Credit</TabsTrigger>
            <TabsTrigger value="invoice">Commercial Invoice</TabsTrigger>
            <TabsTrigger value="bill-of-lading">Bill of Lading</TabsTrigger>
            <TabsTrigger value="certificate">Certificate of Origin</TabsTrigger>
            {document.images.length > 0 && <TabsTrigger value="images">Images ({document.images.length})</TabsTrigger>}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Financial Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(document.letter_of_credit.amount, document.letter_of_credit.currency)}
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Payment Terms</p>
                    <p className="text-sm">{document.letter_of_credit.payment_terms}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">LC Type</p>
                    <p className="text-sm">{document.letter_of_credit.lc_type}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Important Dates
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Issue Date</p>
                    <p className="text-sm">{formatDate(document.letter_of_credit.issue_date)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Expiry Date</p>
                    <p className="text-sm">{formatDate(document.letter_of_credit.expiry_date)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Invoice Date</p>
                    <p className="text-sm">{formatDate(document.commercial_invoice.invoice_date)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">B/L Issue Date</p>
                    <p className="text-sm">{formatDate(document.bill_of_lading.issue_date)}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Ship className="h-5 w-5" />
                    Shipment Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Vessel</p>
                    <p className="text-sm">{document.bill_of_lading.vessel_name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Voyage Number</p>
                    <p className="text-sm">{document.bill_of_lading.voyage_number}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Port of Loading</p>
                    <p className="text-sm">{document.letter_of_credit.port_of_loading}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Port of Discharge</p>
                    <p className="text-sm">{document.letter_of_credit.port_of_discharge}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Incoterms</p>
                    <p className="text-sm">{document.letter_of_credit.incoterms}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Goods Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Description</p>
                    <p className="text-sm">{document.letter_of_credit.goods_description}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Number of Packages</p>
                    <p className="text-sm">{document.bill_of_lading.number_of_packages}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Gross Weight</p>
                    <p className="text-sm">{document.bill_of_lading.gross_weight} kg</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Origin Country</p>
                    <p className="text-sm font-bold">{document.certificate_of_origin.origin_country}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Parties Involved
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium mb-2">Applicant</p>
                    <p className="font-medium">{document.letter_of_credit.applicant_name}</p>
                    <p className="text-sm text-muted-foreground">{document.letter_of_credit.applicant_address}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Beneficiary</p>
                    <p className="font-medium">{document.letter_of_credit.beneficiary_name}</p>
                    <p className="text-sm text-muted-foreground">{document.letter_of_credit.beneficiary_address}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Issuing Bank</p>
                    <p className="text-sm">{document.letter_of_credit.issuing_bank}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Advising Bank</p>
                    <p className="text-sm">{document.letter_of_credit.advising_bank}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="letter-of-credit">
            <Card>
              <CardHeader>
                <CardTitle>Letter of Credit Details</CardTitle>
                <CardDescription>LC Number: {document.letter_of_credit.lc_number}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Issue Date</p>
                    <p className="text-sm">{formatDate(document.letter_of_credit.issue_date)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Expiry Date</p>
                    <p className="text-sm">{formatDate(document.letter_of_credit.expiry_date)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Place of Expiry</p>
                    <p className="text-sm">{document.letter_of_credit.place_of_expiry}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Amount</p>
                    <p className="text-sm font-bold">
                      {formatCurrency(document.letter_of_credit.amount, document.letter_of_credit.currency)}
                    </p>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Applicant</p>
                  <p className="font-medium">{document.letter_of_credit.applicant_name}</p>
                  <p className="text-sm text-muted-foreground">{document.letter_of_credit.applicant_address}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Beneficiary</p>
                  <p className="font-medium">{document.letter_of_credit.beneficiary_name}</p>
                  <p className="text-sm text-muted-foreground">{document.letter_of_credit.beneficiary_address}</p>
                </div>

                <Separator />

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Issuing Bank</p>
                    <p className="text-sm">{document.letter_of_credit.issuing_bank}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Advising Bank</p>
                    <p className="text-sm">{document.letter_of_credit.advising_bank}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Goods Description</p>
                  <p className="text-sm">{document.letter_of_credit.goods_description}</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Port of Loading</p>
                    <p className="text-sm">{document.letter_of_credit.port_of_loading}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Port of Discharge</p>
                    <p className="text-sm">{document.letter_of_credit.port_of_discharge}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Incoterms</p>
                    <p className="text-sm">{document.letter_of_credit.incoterms}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">LC Type</p>
                    <p className="text-sm">{document.letter_of_credit.lc_type}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Payment Terms</p>
                  <p className="text-sm">{document.letter_of_credit.payment_terms}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Documents Required</p>
                  <ul className="list-disc list-inside space-y-1">
                    {document.letter_of_credit.documents_required.map((doc, index) => (
                      <li key={index} className="text-sm">
                        {doc}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invoice">
            <Card>
              <CardHeader>
                <CardTitle>Commercial Invoice</CardTitle>
                <CardDescription>Invoice Number: {document.commercial_invoice.invoice_number}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Invoice Date</p>
                    <p className="text-sm">{formatDate(document.commercial_invoice.invoice_date)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                    <p className="text-sm font-bold">
                      {formatCurrency(document.commercial_invoice.total_amount, document.commercial_invoice.currency)}
                    </p>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Exporter</p>
                  <p className="font-medium">{document.commercial_invoice.exporter_name}</p>
                  <p className="text-sm text-muted-foreground">{document.commercial_invoice.exporter_address}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Importer</p>
                  <p className="font-medium">{document.commercial_invoice.importer_name}</p>
                  <p className="text-sm text-muted-foreground">{document.commercial_invoice.importer_address}</p>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-3">Items</p>
                  <div className="rounded-lg border">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left p-3 text-sm font-medium">Description</th>
                          <th className="text-right p-3 text-sm font-medium">Quantity</th>
                          <th className="text-right p-3 text-sm font-medium">Unit Price</th>
                          <th className="text-right p-3 text-sm font-medium">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {document.commercial_invoice.items.map((item) => (
                          <tr key={item.id} className="border-t">
                            <td className="p-3 text-sm">{item.description}</td>
                            <td className="p-3 text-sm text-right">{item.quantity}</td>
                            <td className="p-3 text-sm text-right">
                              {formatCurrency(item.unit_price, document.commercial_invoice.currency)}
                            </td>
                            <td className="p-3 text-sm text-right font-medium">
                              {formatCurrency(item.total, document.commercial_invoice.currency)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Terms of Payment</p>
                    <p className="text-sm">{document.commercial_invoice.terms_of_payment}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Incoterms</p>
                    <p className="text-sm">{document.commercial_invoice.incoterms}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Shipment Details</p>
                  <p className="text-sm">{document.commercial_invoice.shipment_details}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bill-of-lading">
            <Card>
              <CardHeader>
                <CardTitle>Bill of Lading</CardTitle>
                <CardDescription>B/L Number: {document.bill_of_lading.bl_number}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Issue Date</p>
                    <p className="text-sm">{formatDate(document.bill_of_lading.issue_date)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Originals Issued</p>
                    <p className="text-sm">{document.bill_of_lading.originals_issued}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Shipper</p>
                  <p className="font-medium">{document.bill_of_lading.shipper_name}</p>
                  <p className="text-sm text-muted-foreground">{document.bill_of_lading.shipper_address}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Consignee</p>
                  <p className="font-medium">{document.bill_of_lading.consignee_name}</p>
                  <p className="text-sm text-muted-foreground">{document.bill_of_lading.consignee_address}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Notify Party</p>
                  <p className="text-sm">{document.bill_of_lading.notify_party}</p>
                </div>

                <Separator />

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Vessel Name</p>
                    <p className="text-sm">{document.bill_of_lading.vessel_name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Voyage Number</p>
                    <p className="text-sm">{document.bill_of_lading.voyage_number}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Port of Loading</p>
                    <p className="text-sm">{document.bill_of_lading.port_of_loading}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Port of Discharge</p>
                    <p className="text-sm">{document.bill_of_lading.port_of_discharge}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Goods Description</p>
                  <p className="text-sm">{document.bill_of_lading.goods_description}</p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Number of Packages</p>
                    <p className="text-sm">{document.bill_of_lading.number_of_packages}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Gross Weight</p>
                    <p className="text-sm">{document.bill_of_lading.gross_weight} kg</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Freight Terms</p>
                    <p className="text-sm">{document.bill_of_lading.freight_terms}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="certificate">
            <Card>
              <CardHeader>
                <CardTitle>Certificate of Origin</CardTitle>
                <CardDescription>
                  Certificate Number: {document.certificate_of_origin.certificate_number}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Issue Date</p>
                    <p className="text-sm">{formatDate(document.certificate_of_origin.issue_date)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Origin Country</p>
                    <p className="text-sm font-bold">{document.certificate_of_origin.origin_country}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Exporter</p>
                  <p className="font-medium">{document.certificate_of_origin.exporter_name}</p>
                  <p className="text-sm text-muted-foreground">{document.certificate_of_origin.exporter_address}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Consignee</p>
                  <p className="font-medium">{document.certificate_of_origin.consignee_name}</p>
                  <p className="text-sm text-muted-foreground">{document.certificate_of_origin.consignee_address}</p>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Goods Description</p>
                  <p className="text-sm">{document.certificate_of_origin.goods_description}</p>
                </div>

                <Separator />

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Issuing Chamber</p>
                    <p className="text-sm">{document.certificate_of_origin.issuing_chamber}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Authorized Signature</p>
                    <p className="text-sm">{document.certificate_of_origin.authorized_signature}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {document.images.length > 0 && (
            <TabsContent value="images">
              <Card>
                <CardHeader>
                  <CardTitle>Document Images</CardTitle>
                  <CardDescription>{document.images.length} attached images</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {document.images.map((imagePath, index) => (
                      <div
                        key={index}
                        className="relative aspect-[4/3] overflow-hidden rounded-lg border bg-muted cursor-pointer transition-transform hover:scale-[1.02] hover:shadow-lg"
                        onClick={() => handleImageClick(index)}
                      >
                        <img
                          src={apiUri + imagePath || "/placeholder.svg"}
                          alt={`Document image ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>

        {document.images.length > 0 && (
          <ImageLightbox
            images={document.images.map((path) => apiUri + path)}
            initialIndex={selectedImageIndex}
            open={lightboxOpen}
            onOpenChange={setLightboxOpen}
          />
        )}
      </div>
    </div>
  )
}
