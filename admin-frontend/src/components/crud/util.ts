import {isAxiosError} from 'axios'

export function extractErrorMessages(e: any): Record<string, string> {
  if (isAxiosError(e)) {
    const data = e?.response?.data
    if (data && typeof data === 'object' && data.code === 'FST_ERR_VALIDATION') {
      const validation: Array<any> = data.validation
      const errors: Record<string, string> = {}

      for (const v of validation) {
        errors[v.instancePath] = v?.params?.issue?.message || 'Error'
      }

      return errors
    }
  }

  return {'_root': e.message}
}
