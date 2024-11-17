import {RouteRecordRaw} from 'vue-router'
import {listCrudRoute, tableColumn, tableColumnDate, tableColumnId} from '@/components/crud/list.ts'
import AppsCrudForm from '@/pages/apps/AppsCrudForm.vue'
import {updateCrudRoute} from '@/components/crud/update.ts'
import {createCrudRoute} from '@/components/crud/create.ts'

export const routes: Array<RouteRecordRaw> = [
  listCrudRoute({
    apiUrl: 'apps',
    routePath: '/apps',
    routeName: 'apps.list',
    title: 'Apps',
    search: true,
    createRoute: {name: 'apps.create'},
    editRoute: (entity: any) => ({name: 'apps.edit', params: {id: entity.id}}),
    hasDelete: true,
    columns: [
      tableColumnId(),
      tableColumn({name: 'name', label: 'Name'}),
      tableColumnDate('created_at', 'Created At'),
    ],
  }),

  updateCrudRoute({
    apiUrl: 'apps',
    routePath: '/apps/:id',
    routeName: 'apps.edit',
    title: 'App',
    form: AppsCrudForm,
  }),

  createCrudRoute({
    apiUrl: 'apps',
    routePath: '/apps/create',
    routeName: 'apps.create',
    title: 'Create App',
    form: AppsCrudForm,
  }),
]
