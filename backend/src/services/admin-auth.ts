import {config} from '@/config.ts'
import {createSigner, createVerifier} from 'fast-jwt'

const jwtSecret = config.APP_SECRET
const jwtSigner = createSigner({key: jwtSecret, expiresIn: '7d'})
const jwtVerifier = createVerifier({key: jwtSecret})

export function createAdminToken(userId: string | number) {
  return jwtSigner({['sub']: `${userId}`, 'role': 'admin'})
}

export function verifyAdminToken(token: string) {
  try {
    const data: { sub: string, role: string } & Record<string, any> = jwtVerifier(token)

    if (data.role !== 'admin') {
      return null
    }

    return data

  } catch (ignore) {
    return null
  }
}

export const adminAuthSvc = {
  verifyAdminToken,
}
