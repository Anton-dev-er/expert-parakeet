'use client';
import React, { useEffect, useState } from 'react';
import styles from './SecondarySidebar.module.scss';
import List from '@/src/components/UI/List/List';
import Card from '@/src/components/UI/Card/Card';
import LoginModal from '@/src/components/common/LoginModal/LoginModal';
import useAuthContext from '@/src/hooks/useAuthContext';
import useCheckMobileScreen from '@/src/hooks/useCheckMobileScreen';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesLeft } from '@fortawesome/free-solid-svg-icons';
import UsersModal from '@/src/components/common/UsersModal/UsersModal';
import Notifications from '@/src/components/common/Notifications/Notifications';
import FriendService from '@/src/services/FriendService';
import { Item } from '@/src/components/UI/List/types';
import RoomHistoryService from '@/src/services/RoomHistoryService';

const SecondarySidebar = () => {
  const isMobile = useCheckMobileScreen();
  const { auth, user } = useAuthContext();
  const [isExpand, setIsExpand] = useState(false);
  const [friendList, setFriendList] = useState<Item[]>([]);
  const [historyList, setHistoryList] = useState<Item[]>([]);

  useEffect(() => {
    if (user) {
      FriendService.getFriends(user.id).then((friends) => {
        setFriendList(
          friends.map((friend) => {
            return { content: friend.user.name, id: friend.id };
          })
        );
      });

      RoomHistoryService.getHistory(user.id).then((histories) => {
        setHistoryList(
          histories.map((history) => {
            return { content: history };
          })
        );
      });
    }
  }, [user]);

  useEffect(() => {
    if (isMobile) {
      setIsExpand(false);
    } else {
      setIsExpand(true);
    }
  }, [isMobile]);

  return (
    <>
      {isMobile && (
        <div
          className={`${styles.mobileArrow} ${isExpand ? styles.expand : ''}`}
          onClick={() => {
            setIsExpand(!isExpand);
          }}
        >
          <FontAwesomeIcon icon={faAnglesLeft} />
        </div>
      )}
      {isExpand && (
        <div className={styles.secondarySidebar}>
          {auth ? (
            <div className={styles.secondarySidebarAccount}>
              <p>
                Your account: <strong>{user?.name}</strong>
              </p>
              <Notifications />
            </div>
          ) : (
            <LoginModal />
          )}
          <Card>
            <h2>Friends</h2>
            <List items={friendList} />
            <UsersModal />
          </Card>
          <Card>
            <h2>Rooms history</h2>
            <List items={historyList} />
          </Card>
        </div>
      )}
    </>
  );
};

export default SecondarySidebar;
