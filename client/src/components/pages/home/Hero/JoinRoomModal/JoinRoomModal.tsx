"use client";
import React, { useEffect, useState } from "react";
import Modal from "@/src/components/UI/Modal/Modal";
import Button from "@/src/components/UI/Button/Button";
import { useRouter } from "next/navigation";
import socket from "@/src/lib/socket";
import ACTIONS from "@/src/lib/socket/actions";
import { Item } from "@/src/components/UI/List/types";
import List from "@/src/components/UI/List/List";
import item from "@/src/components/UI/List/Item/Item";

const JoinRoomModal = () => {
  const [open, setOpen] = useState(false);
  const [rooms, updateRooms] = useState([]);
  const [listItems, setListItems] = useState<Item[]>([]);
  const { push } = useRouter();

  useEffect(() => {
    socket.on(ACTIONS.SHARE_ROOMS, ({ rooms = [] }) => {
      updateRooms(rooms);
    });
  }, []);

  useEffect(() => {
    const items: Item[] = rooms.map((roomId): Item => {
      return {
        content: `Click to join to this room: ${roomId}`,
        id: roomId,
        handleOnClick: () => {
          push(`/room/${roomId}`);
        },
      };
    });
    setListItems(items);
  }, [rooms]);

  const handleOnOpen = () => {
    setOpen(true);
  };

  const handleOnClose = () => {
    setOpen(false);
  };


  return (
    <>
      <Button type="outlined" onClick={handleOnOpen}>
        Join Room
      </Button>
      <Modal open={open} handleOnClose={handleOnClose} header="Join Room">
        {listItems.length ? (
          <List items={listItems} />
        ) : (
          <h3>Rooms not found</h3>
        )}
      </Modal>
    </>
  );
};

export default JoinRoomModal;
