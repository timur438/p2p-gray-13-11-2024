import {CookieJar, SerializedCookieJar} from 'tough-cookie'
import axios, {AxiosInstance, AxiosResponse} from 'axios'

const userAgent = 'Mozilla/5.0 (Windows; Windows NT 6.1; x64; en-US) AppleWebKit/603.36 (KHTML, like Gecko) Chrome/49.0.1051.127 Safari/600'

function create(cookies?: CookieJar | SerializedCookieJar | null) {
  const jar = cookies
    ? (
      (cookies instanceof CookieJar)
        ? cookies
        : CookieJar.fromJSON(cookies)
    )
    : new CookieJar()

  const client = axios.create({
    jar,
    headers: {
      'User-Agent': userAgent,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
    },
  })

  // request cookie interceptor
  client.interceptors.request.use(async (config) => {
    const cookieHeader = await jar.getCookieString(config.url || '')
    if (cookieHeader) {
      config.headers['Cookie'] = cookieHeader
    }
    return config
  })

  async function handleResponse(resp: AxiosResponse) {
    const setCookieHeader = resp.headers['set-cookie']
    if (setCookieHeader) {
      for (const cookie of setCookieHeader) {
        await jar.setCookie(cookie, resp.config.url || '')
      }
    }

    return resp
  }

  // response cookie interceptor
  client.interceptors.response.use(
    handleResponse,
    async err => {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          await handleResponse(err.response)
        }
      }
      throw err
    },
  )

  return client
}

async function extractCookies(client: AxiosInstance) {
  const jar = client.defaults.jar || new CookieJar()
  return await jar.serialize()
}

export const clientSvc = {
  create,
  extractCookies,
}
