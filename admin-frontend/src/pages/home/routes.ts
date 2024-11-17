import {RouteRecordRaw} from 'vue-router'

export const routes: Array<RouteRecordRaw> = [
  {
    name: 'home',
    path: '/',
    component: () => import('./HomePage.vue'),
  },
]
