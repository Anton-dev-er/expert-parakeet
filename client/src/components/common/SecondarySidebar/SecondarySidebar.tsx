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

const friendsList = [{ content: 'Friend 1' }, { content: 'Friend 2' }, { content: 'Friend 3' }];

const roomsList = [{ content: 'Room 1' }, { content: 'Room 2' }, { content: 'Room 3' }];

const SecondarySidebar = () => {
  const { user } = useAuthContext();
  const { auth } = useAuthContext();
  const [isExpand, setIsExpand] = useState(false);
  const isMobile = useCheckMobileScreen();

  useEffect(() => {
    if (isMobile) {
      setIsExpand(false);
    } else {
      setIsExpand(true);
    }
  }, [isMobile]);

  console.log('isExpand:', isExpand);

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
            <div style={{ marginBottom: '1em' }}>
              Your account: <strong>{user?.name}</strong>
            </div>
          ) : (
            <LoginModal />
          )}
          <Card>
            <h2>Friends</h2>
            <List items={friendsList} />
          </Card>
          <Card>
            <h2>Rooms history</h2>
            <List items={roomsList} />
          </Card>
        </div>
      )}
    </>
  );
};

export default SecondarySidebar;
