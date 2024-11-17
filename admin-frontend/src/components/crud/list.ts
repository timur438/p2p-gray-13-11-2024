import {RouteLocationRaw, RouteRecordRaw} from 'vue-router'
import {IQTableColumn} from '@/types/quasar.ts'
import {formatDate, PartialOptional} from '@/util.ts'

const crudListFallbackComponent = () => import('./CrudListPage.vue')

export function listCrudRoute(
  params: {
    component?: RouteRecordRaw['component']
    columns: Array<IQTableColumn>
    title: string
    apiUrl: string
    routeName: string
    routePath: string
    search: boolean
    createRoute?: false | RouteLocationRaw
    editRoute?: false | ((entity: any) => RouteLocationRaw)
    hasDelete?: boolean
  },
): RouteRecordRaw {
  return {
    name: params.routeName,
    path: params.routePath,
    component: params.component ?? crudListFallbackComponent,
    props: {
      columns: params.columns,
      title: params.title,
      url: params.apiUrl,
      search: params.search,
      createRoute: params.createRoute,
      editRoute: params.editRoute,
      hasDelete: params.hasDelete,
    },
  }
}

export function tableColumn(column: PartialOptional<IQTableColumn, 'field'>): IQTableColumn {
  return {
    align: 'left',
    field: column.field ?? column.name,
    ...column,
  }
}

export function tableColumnId(): IQTableColumn {
  return tableColumn({
    name: 'id',
    label: 'ID',
    field: 'id',
    sortable: true,
    format: (val: string) => `#${val}`,
  })
}

export function tableColumnDate(name: string, label: string): IQTableColumn {
  return tableColumn({
    name: name,
    label: label,
    field: name,
    sortable: true,
    format: formatDate,
  })
}
