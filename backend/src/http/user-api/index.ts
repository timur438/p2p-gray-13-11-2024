import {IHttp} from '@/http'
import {invoicesController} from '@/http/user-api/controllers/invoices-controller.ts'
import {resourceRoute} from '@/http/common/resource-route.ts'


export async function registerUserApiRoutes(http: IHttp) {
  invoicesController(http)

  await resourceRoute(http, {url: '/user-api/resource'})
}
