const Mime = () => import('mime')

export async function headersFromFileName(file: string) {
  const headers: Record<string, string> = {}

  const split = file.split('.')
  let ext = split.pop()

  if (!ext) {
    return headers
  }

  if (ext === 'br') {
    headers['Content-Encoding'] = 'br'
    ext = split.pop()
  }

  if (ext === 'gz') {
    headers['Content-Encoding'] = 'gzip'
    ext = split.pop()
  }

  if (!ext) {
    return headers
  }

  const resolver = (await Mime()).default

  headers['Content-Type'] = resolver.getType(ext) || 'application/octet-stream'

  return headers
}
