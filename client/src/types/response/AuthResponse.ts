import { User } from '@/src/types'

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: User
}
