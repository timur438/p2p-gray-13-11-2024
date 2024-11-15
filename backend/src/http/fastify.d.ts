import 'fastify'
import {DbEntity} from '@/db/database.ts'

declare module 'fastify' {
  interface FastifyRequest {
    user?: DbEntity<'users'>
  }
}
