'use client';

import React from 'react';
import styles from './Sidebar.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilm, faHome, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import List from '@/src/components/UI/List/List';
import Image from 'next/image';
import Logo from '@/public/logo-2.png';
import Button from '@/src/components/UI/Button/Button';
import useAuthContext from '@/src/hooks/useAuthContext';

const list = [
  {
    content: 'Home',
    ImageComponent: <FontAwesomeIcon fixedWidth={true} icon={faHome} />,
  },
  {
    content: 'Friends',
    ImageComponent: <FontAwesomeIcon fixedWidth={true} icon={faUserGroup} />,
  },
  {
    content: 'Rooms',
    ImageComponent: <FontAwesomeIcon fixedWidth={true} icon={faFilm} />,
  },
];


const Sidebar = () => {
  const { logout, auth } = useAuthContext();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarWrapper}>
        <div>
          <div className={styles.logo}>
            <Image src={Logo} alt="logo" />
          </div>
          <div>
            <List items={list} />
          </div>
        </div>

        <Button disabled={!auth} onClick={handleLogout}>
          Log Out
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
