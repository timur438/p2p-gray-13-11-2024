import {IHttp} from '@/http'
import {db} from '@/db'
import {attachCrudListOperation} from '@/http/admin/crud/crud-list-operation.ts'
import {attachCrudGetOperation} from '@/http/admin/crud/crud-get-operation.ts'

export function registerManagersController(http: IHttp) {
  attachCrudListOperation(http, {
    urlPrefix: 'managers',
    tableName: 'managers',
    baseQuery: db.selectFrom('managers').select(['id', 'login', 'active', 'permissions', 'created_at']),
    searchColumns: ['id', 'login'],
    uniqColumn: 'id',
  })

  attachCrudGetOperation(http, {
    urlPrefix: 'managers',
    tableName: 'managers',
    baseQuery: db.selectFrom('managers').select(['id', 'login', 'active', 'permissions', 'created_at']),
    idColumn: 'id',
  })
}
