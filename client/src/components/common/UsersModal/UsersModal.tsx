'use client';
import React, { useEffect, useState } from 'react';
import Modal from '@/src/components/UI/Modal/Modal';
import List from '@/src/components/UI/List/List';
import styles from './UsersModal.module.scss';
import useAuthContext from '@/src/hooks/useAuthContext';
import { User } from '@/src/types';
import { Item } from '@/src/components/UI/List/types';
import FriendService from '@/src/services/FriendService';
import Loader from '../../UI/Loader/Loader';
import useLoader from '@/src/hooks/useLoader';

const UsersModal = () => {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const { isLoading, setIsLoading } = useLoader();
  const { user } = useAuthContext();

  useEffect(() => {
    if (user) {
      FriendService.getAvailableUsers(user.id).then((users) => {
        setUsers(users);
      });
    }
  }, [user]);

  const handleOnOpen = () => {
    setOpen(true);
  };

  const handleOnClose = () => {
    setOpen(false);
  };

  const onSelectUser = async (friend: User) => {
    setIsLoading(true);
    await FriendService.createInvite(user?.id as string, friend.id);
    setIsLoading(false);
    handleOnClose();
  };

  const prepareUsers = (): Item[] => {
    return users.map((user) => {
      const item: Item = {
        id: user.id,
        content: user.name,
        handleOnClick: () => onSelectUser(user),
      };
      return item;
    });
  };

  return (
    <div style={{ marginBottom: '1em' }}>
      <div className={styles.addFriend} onClick={handleOnOpen}>
        +
      </div>
      <Modal
        open={open}
        handleOnClose={handleOnClose}
        header="Select the user to send the invitation."
      >
        <List items={prepareUsers()} />
      </Modal>
      {isLoading && <Loader />}
    </div>
  );
};

export default UsersModal;
