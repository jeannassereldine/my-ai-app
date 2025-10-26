export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unit_price: number
  total: number
}

export interface LetterOfCredit {
  id: string
  lc_number: string
  issue_date: string
  expiry_date: string
  place_of_expiry: string
  applicant_name: string
  applicant_address: string
  beneficiary_name: string
  beneficiary_address: string
  issuing_bank: string
  advising_bank: string
  amount: number
  currency: string
  lc_type: string
  goods_description: string
  port_of_loading: string
  port_of_discharge: string
  latest_shipment_date: string | null
  incoterms: string
  documents_required: string[]
  payment_terms: string
}

export interface CommercialInvoice {
  id: string
  invoice_number: string
  invoice_date: string
  exporter_name: string
  exporter_address: string
  importer_name: string
  importer_address: string
  items: InvoiceItem[]
  total_amount: number
  currency: string
  terms_of_payment: string
  shipment_details: string
  incoterms: string
}

export interface BillOfLading {
  id: string
  bl_number: string
  issue_date: string
  shipper_name: string
  shipper_address: string
  consignee_name: string
  consignee_address: string
  notify_party: string
  port_of_loading: string
  port_of_discharge: string
  vessel_name: string
  voyage_number: string
  goods_description: string
  number_of_packages: number
  gross_weight: number
  freight_terms: string
  originals_issued: number
}

export interface CertificateOfOrigin {
  id: string
  certificate_number: string
  issue_date: string
  exporter_name: string
  exporter_address: string
  consignee_name: string
  consignee_address: string
  goods_description: string
  origin_country: string
  authorized_signature: string
  issuing_chamber: string
}

export interface TradeDocument {
  id: string
  letter_of_credit: LetterOfCredit
  commercial_invoice: CommercialInvoice
  bill_of_lading: BillOfLading
  certificate_of_origin: CertificateOfOrigin
  images: string[]
}
