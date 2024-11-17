export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleString()
}

export type PartialOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
