import {RouteRecordRaw} from 'vue-router'

const crudCreateFallbackComponent = () => import('./CrudCreatePage.vue')

export function createCrudRoute<T = any>(
  params: {
    component?: RouteRecordRaw['component']
    form: RouteRecordRaw['component']
    title: string
    apiUrl: string
    routeName: string
    routePath: string
    initData?: () => Partial<T>
  },
): RouteRecordRaw {
  return {
    name: params.routeName,
    path: params.routePath,
    component: params.component ?? crudCreateFallbackComponent,
    props: {
      title: params.title,
      urlPart: params.apiUrl,
      component: params.form,
      initData: params.initData || (() => ({})),
    },
  }
}
