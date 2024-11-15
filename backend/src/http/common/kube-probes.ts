import {IHttp} from '@/http'
import {sql} from 'kysely'
import {db} from '@/db'

export async function kubeProbes(http: IHttp) {
  http.get('/probe/alive', async () => {
    return {status: 'ok'}
  })

  http.get('/probe/ready', async () => {
    await Promise.all([
      sql`SELECT 1`.execute(db),
    ])

    return {status: 'ok'}
  })
}
