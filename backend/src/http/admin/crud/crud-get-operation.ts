import {IHttp} from '@/http'
import {authAdminGuard} from '@/http/admin/guard.ts'
import {z} from 'zod'
import {HttpError} from '@/util/exceptions.ts'
import {DB as IDB} from '@/db/database.ts'
import {SelectQueryBuilder, StringReference} from 'kysely'

export interface ICrudGetOperationParams<
  T extends keyof IDB,
  QB extends SelectQueryBuilder<any, any, any>,
  DB extends (QB extends SelectQueryBuilder<infer DB, any, any> ? DB : never),
  TB extends (QB extends SelectQueryBuilder<any, infer T, any> ? T : never),
  O extends (QB extends SelectQueryBuilder<any, any, infer O> ? O : never),
> {
  urlPrefix: string
  tableName: T
  baseQuery: QB
  idColumn: StringReference<DB, TB>
}

export function attachCrudGetOperation<
  T extends keyof IDB,
  QB extends SelectQueryBuilder<any, any, any>,
  DB extends (QB extends SelectQueryBuilder<infer DB, any, any> ? DB : never),
  TB extends (QB extends SelectQueryBuilder<any, infer T, any> ? T : never),
  O extends (QB extends SelectQueryBuilder<any, any, infer O> ? O : never),
>(http: IHttp, params: ICrudGetOperationParams<T, QB, DB, TB, O>) {
  http.route({
    method: 'GET',
    url: `/admin-api/${params.urlPrefix}/:id`,
    preHandler: authAdminGuard(),
    schema: {
      params: z.object({
        id: z.coerce.string().regex(/^\d+$/),
      }),
    },
    async handler(req) {
      const entity = await (params.baseQuery as SelectQueryBuilder<any, any, any>)
        .where(params.idColumn as any, '=', req.params.id)
        .executeTakeFirst()
      if (!entity) {
        throw new HttpError(404, 'Entity not found')
      }

      return entity
    },
  })
}
