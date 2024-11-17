import {IHttp} from '@/http'
import {authAdminGuard} from '@/http/admin/guard.ts'
import {TypeOf, z, ZodType} from 'zod'
import {HttpError} from '@/util/exceptions.ts'
import {DB as IDB} from '@/db/database.ts'
import {SelectQueryBuilder, StringReference} from 'kysely'
// @ts-ignore
import type {SimplifySingleResult} from 'kysely/dist/esm/util/type-utils'

export interface ICrudUpdateOperationParams<
  T extends keyof IDB,
  QB extends SelectQueryBuilder<any, any, any>,
  DB extends (QB extends SelectQueryBuilder<infer DB, any, any> ? DB : never),
  TB extends (QB extends SelectQueryBuilder<any, infer T, any> ? T : never),
  O extends (QB extends SelectQueryBuilder<any, any, infer O> ? O : never),
  V extends ZodType
> {
  urlPrefix: string
  tableName: T
  baseQuery: QB
  idColumn: StringReference<DB, TB>
  validator: V
  fill: (data: TypeOf<V>, entity: SimplifySingleResult<O>) => Promise<any>
}

export function attachCrudUpdateOperation<
  T extends keyof IDB,
  QB extends SelectQueryBuilder<any, any, any>,
  DB extends (QB extends SelectQueryBuilder<infer DB, any, any> ? DB : never),
  TB extends (QB extends SelectQueryBuilder<any, infer T, any> ? T : never),
  O extends (QB extends SelectQueryBuilder<any, any, infer O> ? O : never),
  V extends ZodType
>(http: IHttp, params: ICrudUpdateOperationParams<T, QB, DB, TB, O, V>) {
  http.route({
    method: 'POST',
    url: `/admin-api/${params.urlPrefix}/:id`,
    preHandler: authAdminGuard(),
    schema: {
      params: z.object({
        id: z.coerce.string().regex(/^\d+$/),
      }),
      body: params.validator,
    },
    async handler(req) {
      const entity = await (params.baseQuery as SelectQueryBuilder<any, any, any>)
        .where(params.idColumn as any, '=', req.params.id)
        .executeTakeFirst()
      if (!entity) {
        throw new HttpError(404, 'Entity not found')
      }

      const data = req.body
      if (Object.keys(data as any).length === 0) {
        return entity
      }

      return await params.fill(data, entity)
    },
  })
}
