import {RouteRecordRaw} from 'vue-router'
import {listCrudRoute, tableColumn, tableColumnDate, tableColumnId} from '@/components/crud/list.ts'

export const routes: Array<RouteRecordRaw> = [
  listCrudRoute({
    apiUrl: 'managers',
    routePath: '/managers',
    routeName: 'managers.list',
    title: 'Managers',
    search: true,
    columns: [
      tableColumnId(),
      tableColumn({name: 'login', label: 'Login'}),
      tableColumn({name: 'active', label: 'Active'}),
      tableColumnDate('created_at', 'Created At'),
    ],
  }),
]
