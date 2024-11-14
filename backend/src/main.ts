import Fsp from 'node:fs/promises'
import {clientSvc} from '@/service/client.ts'

export async function runCli() {
  const state = JSON.parse(await Fsp.readFile('./state.json', 'utf-8'))

  const client = clientSvc.create()

  const {data} = await client.get<string>('https://finance.ozon.ru/')

  /*
    cookies will be delivered by user
    only pin auth and get transactions
   */

  state.cookies = await clientSvc.extractCookies(client)
  await Fsp.writeFile('./state.json', JSON.stringify(state, null, 2))

}
