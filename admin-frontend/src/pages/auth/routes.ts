import {RouteRecordRaw} from 'vue-router'

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/auth',
    name: 'auth',
    component: () => import('./AuthPage.vue'),
    meta: {
      layout: 'empty',
      allowGuest: true,
    },
  },
]
