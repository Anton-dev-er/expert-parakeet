'use client'
import React, { useState } from 'react'
import Modal from '@/src/components/UI/Modal/Modal'
import Button from '@/src/components/UI/Button/Button'
import Input from '@/src/components/UI/Input/Input'
import { useRouter } from 'next/navigation'
import { v4 } from 'uuid'
import useAuthContext from '@/src/hooks/useAuthContext'
import { isValidRoomName } from '@/src/utils'
import RoomService from '@/src/services/RoomService'

const CreateRoomModal = () => {
  const [open, setOpen] = useState(false)
  const [roomName, setRoomName] = useState('')
  const { push } = useRouter()
  const { auth, user } = useAuthContext()

  const handleOnOpen = () => {
    setOpen(true)
  }

  const handleOnClose = () => {
    setOpen(false)
  }

  const formatRoomName = (roomName: string) => {
    return encodeURI(roomName.toLowerCase().split(' ').join('-'))
  }

  const handleCreateRoom = async () => {
    // make request for create room
    if (!roomName || !auth || !user) {
      return push(`/room/${v4()}`)
    }

    const room = await RoomService.createRoom(user.id, roomName, false)

    console.log('room:', room)

    if (room) {
      push(`/room/${formatRoomName(room.name)}`)
    }
  }

  return (
    <>
      <Button type="transparent" onClick={handleOnOpen}>
        Create Room
      </Button>
      <Modal open={open} handleOnClose={handleOnClose} header="Create Room">
        <Input
          id="room-name"
          label={'Room name'}
          onChange={setRoomName}
          disabled={!auth}
          validation={{
            function: auth ? isValidRoomName : () => false,
            message: auth ? 'Room name not valid' : 'Log in to create custom room name',
          }}
        />
        <Button onClick={handleCreateRoom}>Join Room</Button>
      </Modal>
    </>
  )
}

export default CreateRoomModal
