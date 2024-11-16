import {IHttp} from '@/http'
import {invoicesController} from '@/http/user-api/controllers/invoices-controller.ts'


export async function registerUserApiRoutes(http: IHttp) {
  invoicesController(http)
}
