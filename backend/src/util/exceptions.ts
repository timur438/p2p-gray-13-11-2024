import {FastifyError} from 'fastify'

export class HttpError extends Error implements FastifyError {
  public code: string = ''
  public statusCode?: number | undefined

  constructor(
    code: number,
    message: string = `Http ${code}`,
  ) {
    super(message)
    this.code = `HTTP_${code}`
    this.statusCode = code
  }

}
