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
        invoice: z.string().min(32).regex(/^[a-f0-9]{32}\d+$/),
      }),
    },
    async handler(req) {
      const paramsInvoice = req.params.invoice
      const invoiceId = paramsInvoice.substring(32)
      const invoiceSecure = paramsInvoice.substring(0, 32)

      const invoice = await db.selectFrom('invoices as i')
        .leftJoin('bank_accounts as ba', 'i.bank_account_id', 'ba.id')
        .select(['i.id', 'i.amount', 'ba.number', 'i.status', 'ba.type', 'i.expires_at', 'i.user_approved_at'])
        .where('i.id', '=', invoiceId)
        .where('i.secure_key', '=', invoiceSecure)
        .executeTakeFirst()
      if (!invoice) {
        throw new HttpError(404)
      }

      return invoice
    },
  })


  http.route({
    method: 'POST',
    url: '/user-api/invoice/:invoice/approve',
    schema: {
      params: z.object({
        invoice: z.string().min(32).regex(/^[a-f0-9]{32}\d+$/),
      }),
    },
    async handler(req) {
      const paramsInvoice = req.params.invoice
      const invoiceId = paramsInvoice.substring(32)
      const invoiceSecure = paramsInvoice.substring(0, 32)

      const invoice = await db.updateTable('invoices')
        .where('id', '=', invoiceId)
        .where('secure_key', '=', invoiceSecure)
        .where('status', '=', 0)
        .set('user_approved_at', qb => qb.fn<Date>('now'))
        .returning('id')
        .executeTakeFirst()
      if (!invoice) {
        throw new HttpError(404)
      }
    },
  })
}
