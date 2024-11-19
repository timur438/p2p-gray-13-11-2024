import {RouteRecordRaw} from 'vue-router'

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/payment/new',
    name: 'payment.new',
    component: () => import('./PaymentCreatePage.vue'),
  },
  {
    path: '/payment/:id',
    name: 'payment',
    component: () => import('./PaymentPage.vue'),
  },
]
