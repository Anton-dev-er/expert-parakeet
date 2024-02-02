"use client";
import React, { useState } from "react";
import Modal from "@/src/components/UI/Modal/Modal";
import Button from "@/src/components/UI/Button/Button";
import { useRouter } from "next/navigation";
import { v4 } from "uuid";

const CreateRoomModal = () => {
  const [open, setOpen] = useState(false);
  const { push } = useRouter();

  const handleOnOpen = () => {
    setOpen(true);
  };

  const handleOnClose = () => {
    setOpen(false);
  };

  const handleCreateRoom = () => {
    push(`/room/${v4()}`);
  };

  return (
    <>
      <Button type="transparent" onClick={handleOnOpen}>
        Create Room
      </Button>
      <Modal open={open} handleOnClose={handleOnClose} header="Create Room">
        <Button onClick={handleCreateRoom}>Create New Room</Button>
      </Modal>
    </>
  );
};

export default CreateRoomModal;
