'use client';
import React, { useEffect, useState } from 'react';
import styles from './Sidebar.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilm, faHome, faUserGroup, faSignOut } from '@fortawesome/free-solid-svg-icons';
import List from '@/src/components/UI/List/List';
import Image from 'next/image';
import Logo from '@/public/logo-2.png';
import useAuthContext from '@/src/hooks/useAuthContext';
import { useRouter } from 'next/navigation';
import { Item } from '@/src/components/UI/List/types';
import useCheckMobileScreen from '@/src/hooks/useCheckMobileScreen';
import Loader from '../../UI/Loader/Loader';
import useLoader from '@/src/hooks/useLoader';

const Sidebar = () => {
  const { logout, auth } = useAuthContext();
  const { push } = useRouter();
  const [list, setList] = useState<Item[]>([]);
  const [mobileList, setMobileList] = useState<Item[]>([]);
  const { isLoading, setIsLoading } = useLoader();

  const isMobile = useCheckMobileScreen();

  useEffect(() => {
    // todo no good
    if (isMobile) {
      setMobileList([
        {
          id: 1,
          content: '',
          ImageComponent: <FontAwesomeIcon fixedWidth={true} icon={faHome} />,
          handleOnClick: () => push('/home'),
          position: 'center',
        },
        {
          id: 2,
          content: '',
          ImageComponent: <FontAwesomeIcon fixedWidth={true} icon={faUserGroup} />,
          position: 'center',
        },
        {
          id: 3,
          content: '',
          ImageComponent: <FontAwesomeIcon fixedWidth={true} icon={faFilm} />,
          position: 'center',
        },
      ]);
    } else {
      setList([
        {
          content: 'Home',
          ImageComponent: <FontAwesomeIcon fixedWidth={true} icon={faHome} />,
          handleOnClick: () => push('/home'),
        },
        {
          content: 'Friends',
          ImageComponent: <FontAwesomeIcon fixedWidth={true} icon={faUserGroup} />,
        },
        {
          content: 'Rooms',
          ImageComponent: <FontAwesomeIcon fixedWidth={true} icon={faFilm} />,
        },
      ]);
    }
  }, [isMobile]);

  const handleLogout = async () => {
    setIsLoading(true);
    if (auth) {
      await logout();
      setIsLoading(false);
    }
    setIsLoading(false);
  };
  // todo, list handled very bad, need to come up with smth
  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarWrapper}>
        <div>
          <div className={styles.logo}>
            <Image src={Logo} alt="logo" />
          </div>
          {!isMobile && <List items={list} />}
          {isMobile && <List items={mobileList} />}
        </div>

        <div onClick={handleLogout} className={styles.logout}>
          <FontAwesomeIcon fixedWidth={true} icon={faSignOut} onClick={handleLogout} />
        </div>
      </div>
      {isLoading && <Loader />}
    </div>
  );
};

export default Sidebar;
