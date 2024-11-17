import {IHttp} from '@/http'
import {db} from '@/db'
import {attachCrudListOperation} from '@/http/admin/crud/crud-list-operation.ts'
import {z} from 'zod'
import {HttpError} from '@/util/exceptions.ts'
import {attachCrudGetOperation} from '@/http/admin/crud/crud-get-operation.ts'
import {attachCrudUpdateOperation} from '@/http/admin/crud/crud-update-operation.ts'
import {attachCrudCreateOperation} from '@/http/admin/crud/crud-create-operation.ts'
import {attachCrudDeleteOperation} from '@/http/admin/crud/crud-delete-operation.ts'

export function registerAppsController(http: IHttp) {
  attachCrudListOperation(http, {
    urlPrefix: 'apps',
    tableName: 'apps',
    baseQuery: db
      .selectFrom('apps as a')
      .selectAll('a'),
    searchColumns: ['a.id', 'a.name'],
    uniqColumn: 'a.id',
  })

  attachCrudGetOperation(http, {
    urlPrefix: 'apps',
    tableName: 'apps',
    baseQuery: db.selectFrom('apps as a').selectAll('a'),
    idColumn: 'a.id',
  })

  attachCrudDeleteOperation(http, {
    urlPrefix: 'apps',
    tableName: 'apps',
    baseQuery: db.deleteFrom('apps as a'),
    idColumn: 'a.id',
  })

  attachCrudUpdateOperation(http, {
    urlPrefix: 'apps',
    tableName: 'apps',
    baseQuery: db.selectFrom('apps as a').selectAll('a'),
    idColumn: 'a.id',
    validator: z.object({
      name: z.string(),
    }).partial(),
    async fill(data, entity) {
      const updated = await db.updateTable('apps')
        .where('id', '=', entity.id)
        .$if(data.name !== undefined, q => q.set('name', data.name!))
        .returningAll()
        .executeTakeFirst()
      if (!updated) {
        throw new HttpError(500, 'Failed to update entity')
      }

      return updated
    },
  })

  attachCrudCreateOperation(http, {
    urlPrefix: 'apps',
    tableName: 'apps',
    validator: z.object({
      name: z.string(),
    }),
    async create(data) {
      return await db.insertInto('apps')
        .values({
          name: data.name,
        })
        .returningAll()
        .executeTakeFirst()
    },
  })
}
