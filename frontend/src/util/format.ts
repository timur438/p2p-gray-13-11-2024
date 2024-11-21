export function formatCardNumber(cardNumber?: string | null): string {
  if (!cardNumber) {
    return ''
  }

  return cardNumber.replace(/(\d{4})/g, '$1 ').trim()
}

export function formatMoney(
  value: number,
  opts?: { ticker?: string, precision?: number, splitter?: string },
) {
  const ticker = opts?.ticker ?? '₽'
  const precision = opts?.precision ?? 0
  const splitter = opts?.splitter ?? ' '

  const parts = value.toFixed(precision).split('.')
  const integer = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, splitter)
  const fractional = (parts[1] || '').replace(/0+$/, '')

  if (!fractional) {
    return `${integer} ${ticker}`.trim()
  }

  return `${integer}.${fractional} ${ticker}`.trim()
}
