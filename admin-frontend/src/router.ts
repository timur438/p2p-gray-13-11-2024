import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'
import {setLayout} from '@/services/layout.ts'
import {authSvc} from '@/services/auth.ts'

interface IRoutesModule {
  routes?: Array<RouteRecordRaw>
}

const routesModules = import.meta.glob<IRoutesModule>('./pages/**/routes.ts', {eager: true})

const routes: Array<RouteRecordRaw> = Object.values(routesModules)
  .flatMap((module) => module.routes || [])

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

// handle auth
// router.beforeEach(to => {
//   if (!to.meta.allowGuest && !authSvc.isAuthenticated.value) {
//     return {name: 'auth'}
//   }
// })

// handle layout
router.beforeEach(to => {
  const layout = to.meta.layout?.toString() || 'main'
  setLayout(layout)
})

