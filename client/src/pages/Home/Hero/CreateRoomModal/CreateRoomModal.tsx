'use client';
import React, { useState } from 'react';
import Modal from '@/src/components/UI/Modal/Modal';
import Button from '@/src/components/UI/Button/Button';
import Input from '@/src/components/UI/Input/Input';
import { useRouter } from 'next/navigation';
import useAuthContext from '@/src/hooks/useAuthContext';
import RoomService from '@/src/services/RoomService';
import { roomHref, isValidRoomName } from '@/src/utils/roomUtils';
import useLoaderContext from '@/src/hooks/useLoaderContext';

const CreateRoomModal = () => {
  const [open, setOpen] = useState(false);
  const [roomName, setRoomName] = useState('');
  const { setLoader } = useLoaderContext();
  const { push } = useRouter();
  const { auth, user } = useAuthContext();

  const handleOnOpen = () => {
    setOpen(true);
  };

  const handleOnClose = () => {
    setOpen(false);
  };

  const formatRoomName = (roomName: string) => {
    return encodeURI(roomName.toLowerCase().split(' ').join('-'));
  };

  const handleCreateRoom = async () => {
    setLoader(true);
    if (!roomName || !auth || !user) {
      setLoader(false);
      return;
    }
    const roomRoute = formatRoomName(roomName);
    const room = await RoomService.createRoom(user.id, roomName, roomRoute, false, true);

    if (room) {
      push(roomHref(room));
    }
    setLoader(false);
  };

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
        <Button onClick={handleCreateRoom}>Create Room</Button>
      </Modal>
    </>
  );
};

export default CreateRoomModal;
