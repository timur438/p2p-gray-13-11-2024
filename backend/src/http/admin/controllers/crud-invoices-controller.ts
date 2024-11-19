import {IHttp} from '@/http'
import {db} from '@/db'
import {attachCrudListOperation} from '@/http/admin/crud/crud-list-operation.ts'
import {z} from 'zod'
import {HttpError} from '@/util/exceptions.ts'
import {sql} from 'kysely'
import {attachCrudGetOperation} from '@/http/admin/crud/crud-get-operation.ts'
import {attachCrudUpdateOperation} from '@/http/admin/crud/crud-update-operation.ts'
import {attachCrudCreateOperation} from '@/http/admin/crud/crud-create-operation.ts'
import {attachCrudDeleteOperation} from '@/http/admin/crud/crud-delete-operation.ts'
import {config} from '@/config.ts'

const paymentBaseUrl = config.APP_URL.replace(/\/$/, '') + '/payment/'

export function registerInvoicesController(http: IHttp) {
  attachCrudListOperation(http, {
    urlPrefix: 'invoices',
    tableName: 'invoices',
    baseQuery: db
      .selectFrom('invoices as i')
      .selectAll('i')
      .select(sql`(${paymentBaseUrl} || i.secure_key::TEXT || i.id::TEXT)`.as('link')),
    searchColumns: ['i.id', 'i.secure_key'],
    uniqColumn: 'i.id',
  })

  attachCrudGetOperation(http, {
    urlPrefix: 'invoices',
    tableName: 'invoices',
    baseQuery: db.selectFrom('invoices as i')
      .selectAll('i')
      .select(sql`(${paymentBaseUrl} || i.secure_key::TEXT || i.id::TEXT)`.as('link')),
    idColumn: 'i.id',
  })

  attachCrudDeleteOperation(http, {
    urlPrefix: 'invoices',
    tableName: 'invoices',
    baseQuery: db.deleteFrom('invoices as i'),
    idColumn: 'i.id',
  })

  attachCrudUpdateOperation(http, {
    urlPrefix: 'invoices',
    tableName: 'invoices',
    baseQuery: db.selectFrom('invoices as i').selectAll('i'),
    idColumn: 'i.id',
    validator: z.object({
      app_id: z.string(),
      amount: z.coerce.number().int(),
      bank_account_id: z.string(),
      status: z.coerce.number().int(),
    }).partial(),
    async fill(data, entity) {
      const updated = await db.updateTable('invoices')
        .where('id', '=', entity.id)
        .$if(data.app_id !== undefined, q => q.set('app_id', data.app_id!))
        .$if(data.amount !== undefined, q => q.set('amount', data.amount!))
        .$if(data.bank_account_id !== undefined, q => q.set('bank_account_id', data.bank_account_id!))
        .$if(data.status !== undefined, q => q.set('status', data.status!))
        .returningAll()
        .executeTakeFirst()
      if (!updated) {
        throw new HttpError(500, 'Failed to update entity')
      }

      return updated
    },
  })

  attachCrudCreateOperation(http, {
    urlPrefix: 'invoices',
    tableName: 'invoices',
    validator: z.object({
      app_id: z.string(),
      amount: z.coerce.number().int(),
      bank_account_id: z.string(),
      status: z.coerce.number().int(),
    }),
    async create(data) {
      return await db.insertInto('invoices')
        .values({
          app_id: data.app_id,
          amount: data.amount,
          bank_account_id: data.bank_account_id,
          status: data.status,
        })
        .returningAll()
        .executeTakeFirst()
    },
  })
}
