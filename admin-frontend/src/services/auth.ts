import {computed, ref} from 'vue'
import {api} from '@/api.ts'
import {useLocalStorage} from '@vueuse/core'

const token = useLocalStorage<string | null>('token', null)
const user = ref<any | null>(null)

const isAuthenticated = computed(() => !!token.value)


async function getTgAuthData() {
  interface Response {
    url: string
    expiresAt: string
    token: string
  }

  const {data} = await api.get<Response>('auth/tg')

  return data
}

async function verifyTgAuthToken(authToken: string) {
  interface Response {
    token: string | null
  }

  const {data} = await api.post<Response>('auth/tg', {token: authToken})

  if (!data.token) {
    return false
  }

  token.value = data.token

  await updateUserData()

  return true
}

async function updateUserData() {
  if (!token.value) {
    return
  }

  const {data} = await api.get('auth/user')

  user.value = data
}

async function logout() {
  token.value = null
  user.value = null
}

export const authSvc = {
  token,
  user,
  isAuthenticated,
  getTgAuthData,
  verifyTgAuthToken,
  updateUserData,
  logout,
}
