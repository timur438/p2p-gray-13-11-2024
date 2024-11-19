import { IHttp } from '@/http'
import { registerAuthController } from '@/http/admin/controllers/auth-controller.ts'
import { registerAppsController } from './controllers/crud-apps-controller'
import {registerManagersController} from '@/http/admin/controllers/crud-managers-controller.ts'
import {registerBankAccountsController} from '@/http/admin/controllers/crud-bank-accounts.controller.ts'
import {registerInvoicesController} from '@/http/admin/controllers/crud-invoices-controller.ts'

export async function registerAdminRoutes(http: IHttp) {
  registerAppsController(http)
  registerManagersController(http)
  registerBankAccountsController(http)
  registerInvoicesController(http)

  registerAuthController(http)
}
