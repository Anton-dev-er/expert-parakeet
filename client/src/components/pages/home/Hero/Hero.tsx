'use client';
import React from 'react';
import styles from './Hero.module.scss';
import CreateRoomModal from '@/src/components/pages/home/Hero/CreateRoomModal/CreateRoomModal';
import JoinRoomModal from '@/src/components/pages/home/Hero/JoinRoomModal/JoinRoomModal';

const Hero = () => {
  return (
    <div className={styles.hero}>
      <h1>Hang out with your friends</h1>
      <div>
        <JoinRoomModal />
        <CreateRoomModal />
      </div>
    </div>
  );
};

export default Hero;
