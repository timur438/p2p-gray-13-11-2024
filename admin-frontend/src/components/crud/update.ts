import {RouteRecordRaw} from 'vue-router'

const crudUpdateFallbackComponent = () => import('./CrudUpdatePage.vue')

export function updateCrudRoute(
  params: {
    component?: RouteRecordRaw['component']
    form: RouteRecordRaw['component']
    title: string
    apiUrl: string
    routeName: string
    routePath: string
  },
): RouteRecordRaw {
  return {
    name: params.routeName,
    path: params.routePath,
    component: params.component ?? crudUpdateFallbackComponent,
    props: {
      title: params.title,
      urlPart: params.apiUrl,
      component: params.form,
    },
  }
}
