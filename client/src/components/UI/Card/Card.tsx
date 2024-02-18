import React, { FC } from 'react';
import styles from './Card.module.scss';

interface Card {
  children: React.ReactNode;
}

const Card: FC<Card> = ({ children }) => {
  return <div className={styles.card}>{children}</div>;
};

export default Card;
