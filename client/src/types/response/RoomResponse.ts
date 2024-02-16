export interface RoomResponse {
  id: string
  name: string
  route: string
  user: {
    id: string
    name: string
    isOwner: boolean
  }
  isPrivate: boolean
}
