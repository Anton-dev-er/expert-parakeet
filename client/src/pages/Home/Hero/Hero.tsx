'use client';
import React from 'react';
import CreateRoomModal from '@/src/pages/Home/Hero/CreateRoomModal/CreateRoomModal';
import JoinRoomModal from '@/src/pages/Home/Hero/JoinRoomModal/JoinRoomModal';
import styles from './Hero.module.scss';

const Hero = () => {
  return (
    <div className={styles.hero}>
      <h1>Hang out with your friends</h1>
      <div>
        {/*<JoinRoomModal />*/}
        {/*<CreateRoomModal />*/}
      </div>
    </div>
  );
};

export default Hero;
