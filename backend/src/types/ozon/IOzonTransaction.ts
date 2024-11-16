/*
const {data} = await client.post('https://finance.ozon.ru/api/v2/clientOperations',{
  "cursors": {
    "next": null,
    "prev": null
  },
  "filter": {
    "categories": [],
    "effect": "EFFECT_UNKNOWN" // better EFFECT_CREDIT
  },
  "perPage": 30
})
*/

/*
{
  hasNextPage: false,
  cursors: { next: null, prev: null },
  items: [
    {
      id: 'A4315183805739290000030011370503',
      operationId: '0193175e-7bb3-3038-81ef-ce03473c6409',
      purpose: 'Степан Валентинович Н.',
      time: '2024-11-10T18:38:08Z',
      merchantCategoryCode: '',
      merchantName: 'Сбербанк',
      image: [Object],
      type: 'SBP_OUTGOING',
      status: 'success',
      sbpMessage: '',
      categoryGroupName: 'Переводы',
      accountAmount: -3000,
      bonus: [],
      meta: {},
      accountAmountV2: [Object],
      isMkkMarked: false
    },
    {
      id: 'A43151835034981D0000010011370503',
      operationId: '0193175b-c640-3ea7-8ac6-5c3109b4b01b',
      purpose: 'Ринат Николаевич К.',
      time: '2024-11-10T18:35:10Z',
      merchantCategoryCode: '',
      merchantName: 'Кошелек ЦУПИС (Мобильная карта)',
      image: [Object],
      type: 'SBP_INCOMING',
      status: 'success',
      sbpMessage: '',
      categoryGroupName: 'Пополнения',
      accountAmount: 3000,
      bonus: [],
      meta: {},
      accountAmountV2: [Object],
      isMkkMarked: false
    }
  ]
}
*/

export interface IOzonTransaction {
  id: string
  operationId: string
  purpose: string
  time: string
  merchantCategoryCode: string
  merchantName: string
  image: Record<any, any>
  type: string
  status: string
  sbpMessage: string
  categoryGroupName: string
  accountAmount: number
  bonus: Array<any>
  meta: Record<any, any>
  accountAmountV2: Record<any, any>
  isMkkMarked: boolean
}
