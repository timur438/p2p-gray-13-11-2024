import {RouteRecordRaw} from 'vue-router'
import {listCrudRoute, tableColumn, tableColumnDate, tableColumnId} from '@/components/crud/list.ts'
import InvoicesCrudForm from '@/pages/invoices/InvoicesCrudForm.vue'
import {updateCrudRoute} from '@/components/crud/update.ts'
import {createCrudRoute} from '@/components/crud/create.ts'

export const routes: Array<RouteRecordRaw> = [
  listCrudRoute({
    apiUrl: 'invoices',
    routePath: '/invoices',
    routeName: 'invoices.list',
    title: 'Invoices',
    search: true,
    createRoute: {name: 'invoices.create'},
    editRoute: (entity: any) => ({name: 'invoices.edit', params: {id: entity.id}}),
    hasDelete: true,
    columns: [
      tableColumnId(),
      tableColumn({name: 'link', label: 'Link'}),
      tableColumn({name: 'status', label: 'Status'}),
      tableColumn({name: 'app_id', label: 'App ID'}),
      tableColumn({name: 'amount', label: 'Amount'}),
      tableColumnDate('user_approved_at', 'User Approved At'),
      tableColumn({name: 'bank_account_id', label: 'Bank Account ID'}),
      tableColumnDate('expires_at', 'Expires At'),
      tableColumnDate('created_at', 'Created At'),
    ],
  }),

  updateCrudRoute({
    apiUrl: 'invoices',
    routePath: '/invoices/:id',
    routeName: 'invoices.edit',
    title: 'Invoice',
    form: InvoicesCrudForm,
  }),

  createCrudRoute({
    apiUrl: 'invoices',
    routePath: '/invoices/create',
    routeName: 'invoices.create',
    title: 'Create Invoice',
    form: InvoicesCrudForm,
  }),
]
