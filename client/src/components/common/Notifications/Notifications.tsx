'use client';
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import FriendService from '@/src/services/FriendService';
import useAuthContext from '@/src/hooks/useAuthContext';
import { FriendResponse } from '@/src/types/response/FriendResponse';
import styles from './Notifications.module.scss';
import Modal from '@/src/components/UI/Modal/Modal';
import Card from '@/src/components/UI/Card/Card';
import Button from '@/src/components/UI/Button/Button';

const Notifications = () => {
  const { user } = useAuthContext();
  const [invites, setInvites] = useState<FriendResponse[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (user) {
      FriendService.getInvites(user.id).then((invites) => {
        setInvites(invites);
      });
    }
  }, [user]);

  const handleOnIconClick = () => {
    setOpen(!open);
  };

  const handleOnClose = () => {
    setOpen(false);
  };

  const acceptInvite = async (friendId: string) => {
    handleOnClose();
    await FriendService.acceptInvite(friendId);
  };

  const declineInvite = async (friendId: string) => {
    handleOnClose();
    await FriendService.declineInvite(friendId);
  };

  // todo
  return (
    <div>
      <div className={styles.notificationsIcon}>
        <FontAwesomeIcon icon={faBell} cursor="pointer" onClick={handleOnIconClick} />
        <span>{invites.length}</span>
      </div>
      {open && (
        <Modal open={open} header="Friends invites" handleOnClose={handleOnClose}>
          {invites.map((invite) => {
            return (
              <Card key={invite.id}>
                <p>User: {invite.user.name}</p>
                <p>Email: {invite.user.email}</p>
                <div style={{ marginTop: '1em' }}>
                  <Button onClick={() => acceptInvite(invite.id)}>Accept</Button>
                  <Button onClick={() => declineInvite(invite.id)} type="outlined">
                    Decline
                  </Button>
                </div>
              </Card>
            );
          })}
        </Modal>
      )}
    </div>
  );
};

export default Notifications;
