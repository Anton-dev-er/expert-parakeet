import { User } from '@/src/types'

export interface RoomResponse {
  id: string
  name: string
  isOwner: boolean
  isPrivate: boolean
}
