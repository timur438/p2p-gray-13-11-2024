import {RouteRecordRaw} from 'vue-router'

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: () => import('./HomePage.vue'),
  },
]
