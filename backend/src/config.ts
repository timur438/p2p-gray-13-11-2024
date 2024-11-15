import {z} from 'zod'

const validator = z.object({
  /**
   * Secret key for the app encryption and validation.
   * Should be a 64-character hex value.
   */
  APP_SECRET: z.string().length(64).nullish(),
  /**
   * Redis URL.
   */
  REDIS_URL: z.string().url().nullish(),
  /**
   * Postgres database URL or connection string.
   */
  DATABASE_URL: z.string().url().nullish(),
})

export const parse = validator.safeParse(process.env)

if (!parse.success) {
  console.error('Invalid env:', parse.error.message)
  process.exit(1)
}

export const config = parse.data
