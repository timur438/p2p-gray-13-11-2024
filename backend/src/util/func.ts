export async function safePromise<T>(promise: Promise<T>): Promise<T | Error> {
  try {
    return await promise
  } catch (error: any) {
    return error
  }
}

export function jsonParseSafe<T = any>(data: string): T | null {
  try {
    return JSON.parse(data)
  } catch (error) {
    return null
  }
}

export function objectPick<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: Array<K>,
): Pick<T, K> {
  const newObj: any = {}
  for (const key of keys) {
    if (key in obj) {
      newObj[key] = obj[key]
    }
  }
  return newObj
}

export function objectOmit<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: Array<K>,
): Omit<T, K> {
  const newObj: any = {}
  for (const key in obj) {
    if (!keys.includes(key as any)) {
      newObj[key] = obj[key]
    }
  }
  return newObj
}
