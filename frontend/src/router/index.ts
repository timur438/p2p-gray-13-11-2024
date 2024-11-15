import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'

interface IRouteModule {
  routes?: Array<RouteRecordRaw>
}

const routeModules = import.meta.glob<IRouteModule>('../pages/**/routes.ts', {eager: true})

const routes = Object.values(routeModules)
  .flatMap((module) => module.routes ?? [])

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
