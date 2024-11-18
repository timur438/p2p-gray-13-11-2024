import {RouteRecordRaw} from 'vue-router'

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/payment/:id',
    name: 'payment',
    component: () => import('./PaymentPage.vue'),
  },
]
