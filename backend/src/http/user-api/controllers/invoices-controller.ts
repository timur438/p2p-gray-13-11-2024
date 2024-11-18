import {IHttp} from '@/http'
import {z} from 'zod'
import {db} from '@/db'
import {HttpError} from '@/util/exceptions.ts'

export function invoicesController(http: IHttp) {

  http.route({
    method: 'GET',
    url: '/user-api/invoice/:invoice',
    schema: {
      params: z.object({
        invoice: z.string().min(32),
      }),
    },
    async handler(req) {
      const paramsInvoice = req.params.invoice
      const invoiceId = paramsInvoice.substring(32)
      const invoiceSecure = paramsInvoice.substring(0, 32)

      const invoice = await db.selectFrom('invoices as i')
        .leftJoin('bank_accounts as ba', 'i.bank_account_id', 'ba.id')
        .select(['i.id', 'i.amount', 'ba.number', 'ba.type', 'i.expires_at'])
        .where('i.id', '=', invoiceId)
        .where('i.secure_key', '=', invoiceSecure)
        .executeTakeFirst()
      if (!invoice) {
        throw new HttpError(404)
      }

      return invoice
    },
  })
}
