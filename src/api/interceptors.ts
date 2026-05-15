import type { AxiosInstance } from 'axios'
import { useAuthStore } from '@/stores/auth'

let routerRef: { push: (path: string) => void } | null = null

export function setAuthRouter(router: { push: (path: string) => void }) {
  routerRef = router
}

export function attachAuthInterceptors(instance: AxiosInstance) {
  instance.interceptors.request.use((config) => {
    const auth = useAuthStore()
    const token = auth.accessToken
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  instance.interceptors.response.use(
    (res) => res,
    (err) => {
      const status = err?.response?.status
      if (status === 401) {
        const auth = useAuthStore()
        auth.clearSession()
        routerRef?.push('/login')
      }
      return Promise.reject(err)
    },
  )
}
