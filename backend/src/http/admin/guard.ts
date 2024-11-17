import {FastifyRequest} from 'fastify'
import {IHttp} from '@/http'

export function authAdminGuard(
  opts?: {
    permissions?: Array<string>
  },
) {
  return async function (
    this: IHttp,
    request: FastifyRequest,
  ) {

    return

    /*const token = (request.headers['authorization'] || '').replace(/^Bearer /i, '').trim()
    if (!token) {
      throw new HttpError(401, 'Unauthorized')
    }

    const data = adminAuthSvc.verifyAdminToken(token)
    if (!data) {
      throw new HttpError(401, 'Unauthorized')
    }

    const user = await db.selectFrom('managers')
      .selectAll()
      .where('id', '=', data.sub)
      .executeTakeFirst()
    if (!user) {
      throw new HttpError(401, 'Unauthorized')
    }

    const permissions = opts?.permissions
    if (permissions) {
      for (const permission of permissions) {
        if (!user.permissions.includes(permission)) {
          throw new HttpError(403, 'Forbidden')
        }
      }
    }

    request.user = user*/
  }
}
