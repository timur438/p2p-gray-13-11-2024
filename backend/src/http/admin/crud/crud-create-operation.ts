import {IHttp} from '@/http'
import {authAdminGuard} from '@/http/admin/guard.ts'
import {TypeOf, ZodType} from 'zod'
import {DB as IDB} from '@/db/database.ts'
import {SelectQueryBuilder} from 'kysely'

export interface ICrudCreateOperationParams<
  T extends keyof IDB,
  QB extends SelectQueryBuilder<any, any, any>,
  DB extends (QB extends SelectQueryBuilder<infer DB, any, any> ? DB : never),
  TB extends (QB extends SelectQueryBuilder<any, infer T, any> ? T : never),
  O extends (QB extends SelectQueryBuilder<any, any, infer O> ? O : never),
  V extends ZodType
> {
  urlPrefix: string
  tableName: T
  validator: V
  create: (data: TypeOf<V>) => Promise<any>
}

export function attachCrudCreateOperation<
  T extends keyof IDB,
  QB extends SelectQueryBuilder<any, any, any>,
  DB extends (QB extends SelectQueryBuilder<infer DB, any, any> ? DB : never),
  TB extends (QB extends SelectQueryBuilder<any, infer T, any> ? T : never),
  O extends (QB extends SelectQueryBuilder<any, any, infer O> ? O : never),
  V extends ZodType
>(http: IHttp, params: ICrudCreateOperationParams<T, QB, DB, TB, O, V>) {
  http.route({
    method: 'POST',
    url: `/admin-api/${params.urlPrefix}`,
    preHandler: authAdminGuard(),
    schema: {
      body: params.validator,
    },
    async handler(req) {
      return await params.create(req.body)
    },
  })
}
