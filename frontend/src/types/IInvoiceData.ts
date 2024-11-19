export interface IInvoiceData {
  id: string
  amount: number
  /**
   * 0: pending, 1: paid, 2: canceled
   */
  status: 0 | 1 | 2
  expires_at: string
  number: string | null
  type: string | null
  card_number: string | null
  user_approved_at: string | null
}
