import {DbEntity} from '@/db/database.ts'
import {db} from '@/db'
import {webappSvc} from '@/services/webapp.ts'

export async function getUserByToken(token: string | null | undefined): Promise<DbEntity<'users'> | null> {
  if (!token) {
    return null
  }

  token = token.replace(/^Bearer\s+/i, '')

  const data = webappSvc.verifyToken(token)
  if (!data?.sub) {
    return null
  }

  const user = await db.selectFrom('users')
    .selectAll()
    .where('id', '=', data.sub)
    .executeTakeFirst()
  if (!user) {
    return null
  }

  return user
}
