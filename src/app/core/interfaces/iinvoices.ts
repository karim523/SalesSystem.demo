export interface IInvoiceCreate {
  customerName: string
  discountPercentage: number
  type: number
  items: Item[]
}

export interface Item {
  productId: number
  quantity: number
}
export interface IInvoice {
  id: number
  invoiceNumber: string
  type: number
  customerName: string
  invoiceDate: string
  subTotal: number
  discount: number
  total: number
}
export enum type {
  Sale = 1,
  Purchase = 2
}
