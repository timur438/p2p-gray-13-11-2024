import { config as loadEnv } from 'dotenv';
import { z } from 'zod';

loadEnv();

const validator = z.object({
  /**
   * Secret key for the app encryption and validation.
   * Should be a 64-character hex value.
   */
  APP_SECRET: z.string().length(64),
  /**
   * App URL.
   */
  APP_URL: z.string().url(),
  /**
   * Redis URL.
   */
  REDIS_URL: z.string().url(),
  /**
   * Postgres database URL or connection string.
   */
  DATABASE_URL: z.string().url(),
});

export const parse = validator.safeParse(process.env);

if (!parse.success) {
  console.error('Invalid env:', JSON.stringify(parse.error.errors, null, 2));
  process.exit(1);
}

export const config = parse.data;
