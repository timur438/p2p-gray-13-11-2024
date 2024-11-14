import 'axios'
import {CookieJar} from 'tough-cookie'

declare module 'axios' {
  export interface AxiosRequestConfig {
    jar?: CookieJar
  }
}
