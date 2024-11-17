import {IHttp} from '@/http'
import {authAdminGuard} from '@/http/admin/guard.ts'
import {z} from 'zod'
import {DB as IDB} from '@/db/database.ts'
import {DeleteQueryBuilder, Selectable, StringReference} from 'kysely'

export interface ICrudDeleteOperationParams<
  T extends keyof IDB,
  QB extends DeleteQueryBuilder<any, any, any>,
  DB extends (QB extends DeleteQueryBuilder<infer DB, any, any> ? DB : never),
  TB extends (QB extends DeleteQueryBuilder<any, infer T, any> ? T : never),
  O extends (QB extends DeleteQueryBuilder<any, any, infer O> ? O : never),
> {
  urlPrefix: string
  tableName: T
  baseQuery: QB
  idColumn: StringReference<DB, TB>
  afterDelete?: (record: Selectable<DB[T]>) => void | Promise<void>
}

export function attachCrudDeleteOperation<
  T extends keyof IDB,
  QB extends DeleteQueryBuilder<any, any, any>,
  DB extends (QB extends DeleteQueryBuilder<infer DB, any, any> ? DB : never),
  TB extends (QB extends DeleteQueryBuilder<any, infer T, any> ? T : never),
  O extends (QB extends DeleteQueryBuilder<any, any, infer O> ? O : never),
>(http: IHttp, params: ICrudDeleteOperationParams<T, QB, DB, TB, O>) {
  http.route({
    method: 'DELETE',
    url: `/admin-api/${params.urlPrefix}/:id`,
    preHandler: authAdminGuard(),
    schema: {
      params: z.object({
        id: z.coerce.string().regex(/^\d+$/),
      }),
    },
    async handler(req) {
      const record = await (params.baseQuery as DeleteQueryBuilder<any, any, O>)
        .returningAll()
        .where(params.idColumn as any, '=', req.params.id)
        .executeTakeFirst()

      if (params.afterDelete) {
        await params.afterDelete(record)
      }
    },
  })
}
