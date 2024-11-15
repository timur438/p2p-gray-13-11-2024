import {z} from 'zod'
import {db} from '@/db'
import {HttpError} from '@/util/exceptions.ts'
import {storage} from '@/services/storage'
import {ObjectNotFound} from '@silvertree/storage/standalone'
import {IHttp} from '@/http'

export async function resourceRoute(http: IHttp, options: { url: string }) {
  if (!options.url) {
    throw new Error('Resource route URL is required')
  }

  http.route({
    method: ['GET', 'HEAD'],
    url: `${options.url}/:hash`,
    schema: {
      params: z.object({
        hash: z.string().length(64),
      }),
    },
    async handler(req, repl) {
      const resource = await db.selectFrom('resources')
        .select(['mime_type', 'name'])
        .where('hash', '=', req.params.hash)
        .executeTakeFirst()
      if (!resource) {
        throw new HttpError(404, 'Resource not found')
      }

      try {
        const stream = await storage.getStream(req.params.hash)

        return repl
          .headers({
            'Content-Type': resource.mime_type,
            'Content-Disposition': `inline; filename="${resource.name}"`,
            'Cache-Control': 'public, max-age=31536000',
          })
          .send(stream)

      } catch (e) {
        if (e instanceof ObjectNotFound) {
          throw new HttpError(404, 'Resource not found')
        }

        throw e
      }
    },
  })
}
