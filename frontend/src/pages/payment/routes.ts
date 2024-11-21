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
    component: () => import('./PaymentPageWrapper.vue'),
    children: [
      {
        path: '',
        name: 'payment.begin',
        component: () => import('./PaymentBeginPage.vue'),
      },
      {
        path: 'card',
        name: 'payment.card',
        component: () => import('./PaymentCardPage.vue'),
      },
      {
        path: 'phone',
        name: 'payment.phone',
        component: () => import('./PaymentPhonePage.vue'),
      },
      {
        path: 'wait',
        name: 'payment.wait',
        component: () => import('./PaymentWaitPage.vue'),
      },
      {
        path: 'result',
        name: 'payment.result',
        component: () => import('./PaymentResultPage.vue'),
      },
    ],
  },
]
