import {IHttp} from '@/http'
import {z} from 'zod'
import {db} from '@/db'
import {HttpError} from '@/util/exceptions.ts'
import {config} from '@/config.ts'

export function invoicesController(http: IHttp) {


  http.route({
    method: 'POST',
    url: '/user-api/invoice/new',
    schema: {
      body: z.object({
        price: z.coerce.number().int().positive(),
      }),
    },
    async handler(req) {
      const price = req.body.price

      const app = await db.selectFrom('apps')
        .select('id')
        .orderBy('id', 'asc')
        .limit(1)
        .executeTakeFirst()
      if (!app) {
        throw new HttpError(400, 'No apps')
      }

      const bankAccount = await db.selectFrom('bank_accounts as ba')
        .where(qb => qb.not(qb.exists(
          qb.selectFrom('invoices as i')
            .whereRef('i.bank_account_id', '=', 'ba.id')
            .where('i.status', '=', 0)
            .where('i.expires_at', '>', db.fn<Date>('now')),
        )))
        .select('ba.id')
        .orderBy('ba.id', 'asc')
        .limit(1)
        .executeTakeFirst()
      if (!bankAccount) {
        throw new HttpError(400, 'No bank accounts')
      }

      const invoice = await db.insertInto('invoices')
        .values({
          app_id: app.id,
          bank_account_id: bankAccount.id,
          amount: price,
        })
        .returning(['id', 'secure_key'])
        .executeTakeFirst()
      if (!invoice) {
        throw new HttpError(500)
      }

      const url = config.APP_URL.replace(/\/$/, '') + `/payment/${invoice.secure_key}${invoice.id}`

      return {url}
    },
  })

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
        .select(['i.id', 'i.amount', 'ba.number', 'i.status', 'ba.type', 'i.expires_at', 'i.user_approved_at', 'ba.card_number'])
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
