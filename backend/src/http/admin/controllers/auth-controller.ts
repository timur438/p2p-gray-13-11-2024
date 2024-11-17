import {IHttp} from '@/http'
import {z} from 'zod'

export function registerAuthController(http: IHttp) {
  http.route({
    method: 'POST',
    url: '/admin-api/auth/login',
    schema: {
      body: z.object({
        login: z.string().min(1),
        password: z.string().min(1),
      }),
    },
    async handler(req) {
      // TODO
    },
  })

}
