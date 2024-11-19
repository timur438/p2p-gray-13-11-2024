import {IHttp} from '@/http'
import {db} from '@/db'
import {attachCrudListOperation} from '@/http/admin/crud/crud-list-operation.ts'
import {z} from 'zod'
import {HttpError} from '@/util/exceptions.ts'
import {attachCrudGetOperation} from '@/http/admin/crud/crud-get-operation.ts'
import {attachCrudUpdateOperation} from '@/http/admin/crud/crud-update-operation.ts'
import {attachCrudCreateOperation} from '@/http/admin/crud/crud-create-operation.ts'
import {attachCrudDeleteOperation} from '@/http/admin/crud/crud-delete-operation.ts'
import {CookieJar} from 'tough-cookie'
import {sql} from 'kysely'

export function registerBankAccountsController(http: IHttp) {
  attachCrudListOperation(http, {
    urlPrefix: 'bank-accounts',
    tableName: 'bank_accounts',
    baseQuery: db
      .selectFrom('bank_accounts as b')
      .selectAll('b'),
    searchColumns: ['b.id', 'b.type', 'b.number'],
    uniqColumn: 'b.id',
  })

  attachCrudGetOperation(http, {
    urlPrefix: 'bank-accounts',
    tableName: 'bank_accounts',
    baseQuery: db
      .selectFrom('bank_accounts as b')
      .selectAll('b')
      .select(sql.raw(`(b.auth -> 'proxy')`).as('proxy')),
    idColumn: 'b.id',
  })

  attachCrudDeleteOperation(http, {
    urlPrefix: 'bank-accounts',
    tableName: 'bank_accounts',
    baseQuery: db.deleteFrom('bank_accounts as b'),
    idColumn: 'b.id',
  })

  attachCrudUpdateOperation(http, {
    urlPrefix: 'bank-accounts',
    tableName: 'bank_accounts',
    baseQuery: db.selectFrom('bank_accounts as b').selectAll('b'),
    idColumn: 'b.id',
    validator: z.object({
      type: z.string(),
      number: z.string(),
      card_number: z.string().nullable(),
      proxy: z.object({
        ip: z.string(),
        port: z.number(),
        login: z.string(),
        password: z.string(),
      }).optional(),
      cookies: z.record(z.string(), z.array(z.string())).optional(),
    }).partial(),
    async fill(data, entity) {

      const jar = new CookieJar()

      for (const [url, entries] of Object.entries(data.cookies ?? [])) {
        for (const entry of entries) {
          if (!entry) {
            continue
          }
          jar.setCookieSync(entry, url)
        }
      }

      const serializedCookies = await jar.serialize()

      const updated = await db.updateTable('bank_accounts')
        .where('id', '=', entity.id)

        .$if(
          data.proxy !== undefined || data.cookies !== undefined,
          q => {
            const obj = entity.auth

            if (data.proxy !== undefined) {
              obj.proxy = data.proxy
            }

            if (data.cookies !== undefined && serializedCookies.cookies.length > 0) {
              obj.cookies = serializedCookies
            }

            return q.set('auth', obj)
          },
        )
        .$if(data.type !== undefined, q => q.set('type', data.type!))
        .$if(data.number !== undefined, q => q.set('number', data.number!))
        .$if(data.card_number !== undefined, q => q.set('card_number', data.card_number))
        .returningAll()
        .executeTakeFirst()
      if (!updated) {
        throw new HttpError(500, 'Failed to update entity')
      }

      return updated
    },
  })

  attachCrudCreateOperation(http, {
    urlPrefix: 'bank-accounts',
    tableName: 'bank_accounts',
    validator: z.object({
      type: z.string(),
      number: z.string(),
      card_number: z.string().nullable(),
      proxy: z.object({
        ip: z.string(),
        port: z.number(),
        login: z.string(),
        password: z.string(),
      }),
      cookies: z.record(z.string(), z.array(z.string())),
    }),
    async create(data) {
      const jar = new CookieJar()

      for (const [url, entries] of Object.entries(data.cookies)) {
        for (const entry of entries) {
          if (!entry) {
            continue
          }
          await jar.setCookie(entry, url)
        }
      }

      return await db.insertInto('bank_accounts')
        .values({
          type: data.type,
          number: data.number,
          card_number: data.card_number,
          auth: {
            proxy: data.proxy,
            cookies: await jar.serialize(),
          },
        })
        .returningAll()
        .executeTakeFirst()
    },
  })
}
