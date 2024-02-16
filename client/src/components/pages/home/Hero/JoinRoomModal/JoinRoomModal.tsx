'use client'
import React, { useEffect, useState } from 'react'
import Modal from '@/src/components/UI/Modal/Modal'
import Button from '@/src/components/UI/Button/Button'
import RoomService from '@/src/services/RoomService'
import useAuthContext from '@/src/hooks/useAuthContext'
import List from '@/src/components/UI/List/List'
import { Item } from '@/src/components/UI/List/types'
import { useRouter } from 'next/navigation'
import { roomHref } from '@/src/utils/room.utils'
import { RoomResponse } from '@/src/types/response/RoomResponse'

const JoinRoomModal = () => {
  const [open, setOpen] = useState(false)
  const [userPublicRooms, setUserPublicRooms] = useState<Item[]>([])
  const [userPrivateRooms, setUserPrivateRooms] = useState<Item[]>([])
  const { auth, user } = useAuthContext()
  const { push } = useRouter()

  const getFilteredRoomList = (rooms: RoomResponse[], isPrivate = false) => {
    return rooms
      .filter((room) => room.isPrivate === isPrivate)
      .map((room) => {
        return {
          content: room.name,
          id: room.id,
          handleOnClick: () => push(roomHref(room.id)),
        }
      })
  }

  useEffect(() => {
    if (auth && user) {
      RoomService.getUserRooms(user.id).then((rooms) => {
        setUserPublicRooms(getFilteredRoomList(rooms, false))
        setUserPrivateRooms(getFilteredRoomList(rooms, true))
      })
    }
  }, [user])

  const handleOnOpen = () => {
    setOpen(true)
  }

  const handleOnClose = () => {
    setOpen(false)
  }

  return (
    <>
      <Button type="outlined" onClick={handleOnOpen}>
        My rooms
      </Button>
      <Modal open={open} handleOnClose={handleOnClose} header="My rooms">
        {!!userPublicRooms.length && (
          <>
            <h3>Public Rooms</h3>
            <List items={userPublicRooms} />
          </>
        )}

        {!!userPrivateRooms.length && (
          <>
            <h3>Private Rooms</h3>
            <List items={userPrivateRooms} />
          </>
        )}

        {!userPublicRooms.length && !userPrivateRooms.length && <h3>Rooms not found</h3>}
      </Modal>
    </>
  )
}

export default JoinRoomModal
