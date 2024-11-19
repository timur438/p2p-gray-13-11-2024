import {RouteRecordRaw} from 'vue-router'
import {listCrudRoute, tableColumn, tableColumnDate, tableColumnId} from '@/components/crud/list.ts'
import BankAccountsCrudForm from '@/pages/bank-accounts/BankAccountsCrudForm.vue'
import {updateCrudRoute} from '@/components/crud/update.ts'
import {createCrudRoute} from '@/components/crud/create.ts'
import BankAccountSelect from '@/components/crud/commons/BankAccountSelect.vue'

export const routes: Array<RouteRecordRaw> = [
  listCrudRoute({
    apiUrl: 'bank-accounts',
    routePath: '/bank-accounts',
    routeName: 'bank-accounts.list',
    title: 'Bank Accounts',
    search: true,
    createRoute: {name: 'bank-accounts.create'},
    editRoute: (entity: any) => ({name: 'bank-accounts.edit', params: {id: entity.id}}),
    hasDelete: true,
    columns: [
      tableColumnId(),
      tableColumn({name: 'type', label: 'Type'}),
      tableColumn({name: 'number', label: 'Number'}),
      tableColumnDate('created_at', 'Created At'),
    ],
  }),

  updateCrudRoute({
    apiUrl: 'bank-accounts',
    routePath: '/bank-accounts/:id',
    routeName: 'bank-accounts.edit',
    title: 'Bank Account',
    form: BankAccountsCrudForm,
  }),

  createCrudRoute({
    apiUrl: 'bank-accounts',
    routePath: '/bank-accounts/create',
    routeName: 'bank-accounts.create',
    title: 'Create Bank Account',
    initData: () => ({
      type: 'ozon',
      number: '',
      proxy: {ip: '', port: 0, login: '', password: ''},
      cookies: {},
    }),
    form: BankAccountsCrudForm,
  }),

  {
    path: '/bank-accounts/select',
    name: 'bank-accounts.select',
    component: BankAccountSelect,
    meta: {title: 'Select Bank Account'},
  },
]
