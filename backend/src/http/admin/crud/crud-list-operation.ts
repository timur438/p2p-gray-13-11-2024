import {DB as IDB} from '@/db/database.ts'
import {ReferenceExpression, SelectQueryBuilder, StringReference} from 'kysely'
import {IHttp} from '@/http'
import {authAdminGuard} from '@/http/admin/guard.ts'
import {z} from 'zod'
import {fetchItemsAndCountWithPagination, querySearchFn} from '@/http/admin/util.ts'

export interface ICrudListOperationParams<
  T extends keyof IDB,
  QB extends SelectQueryBuilder<any, any, any>,
  DB extends (QB extends SelectQueryBuilder<infer DB, any, any> ? DB : never),
  TB extends (QB extends SelectQueryBuilder<any, infer T, any> ? T : never),
  O extends (QB extends SelectQueryBuilder<any, any, infer O> ? O : never),
> {
  urlPrefix: string
  tableName: T
  baseQuery: QB
  searchColumns?: Array<ReferenceExpression<DB, TB>>
  uniqColumn?: StringReference<DB, TB> | null
}

export function attachCrudListOperation<
  T extends keyof IDB,
  QB extends SelectQueryBuilder<any, any, any>,
  DB extends (QB extends SelectQueryBuilder<infer DB, any, any> ? DB : never),
  TB extends (QB extends SelectQueryBuilder<any, infer T, any> ? T : never),
  O extends (QB extends SelectQueryBuilder<any, any, infer O> ? O : never),
>(
  http: IHttp,
  params: ICrudListOperationParams<T, QB, DB, TB, O>,
) {
  http.route({
    method: 'GET',
    url: `/admin-api/${params.urlPrefix}`,
    preHandler: authAdminGuard(),
    schema: {
      querystring: z.object({
        limit: z.coerce.number().int().gt(0).max(500).default(10),
        offset: z.coerce.number().int().gte(0).default(0),
        search: z.string().optional(),
      }),
    },
    async handler(request) {
      const baseQuery = (params.baseQuery as SelectQueryBuilder<any, any, any>)
        .$call(querySearchFn(request.query.search, params.searchColumns ?? []))

      return await fetchItemsAndCountWithPagination(
        baseQuery,
        request.query.limit,
        request.query.offset,
        params.uniqColumn ?? null,
      )
    },
  })
}
