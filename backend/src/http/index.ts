import {fastify} from 'fastify'
import {serializerCompiler, validatorCompiler, ZodTypeProvider} from 'fastify-type-provider-zod'
import {logger} from '../logger.ts'
import {kubeProbes} from '@/http/common/kube-probes.ts'

export const httpLogger = logger.child({name: 'http'})

export type IHttp = ReturnType<typeof createHttpServer>

export function createHttpServer() {

  const server = fastify({
    loggerInstance: httpLogger,
    disableRequestLogging: true,
    return503OnClosing: true,
  })

  server.setValidatorCompiler(validatorCompiler)
  server.setSerializerCompiler(serializerCompiler)

  server.register(kubeProbes)

  server.setErrorHandler((error, request, reply) => {
    const statusCode = error.statusCode ?? 500

    if (statusCode >= 500) {
      httpLogger.error(
        {
          id: request.id,
          params: request.params,
          query: request.query,
          body: request.body,
        },
        error ? error.message : 'Error',
      )

      httpLogger.error(error.stack)

      const message = 'Internal Server Error'
      reply.status(statusCode).send({message})
      return
    }

    reply.status(statusCode).send({...error})
  })

  return server.withTypeProvider<ZodTypeProvider>()
}
