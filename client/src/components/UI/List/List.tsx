'use client';
import React, { FC } from 'react';
import styles from './List.module.scss';
import Item from '@/src/components/UI/List/Item/Item';
import { List } from '@/src/components/UI/List/types';

const List: FC<List> = ({ items }) => {
  return (
    <ul className={styles.list}>
      {items.map((item) => (
        <Item key={item.id || item.content} {...item} />
      ))}
    </ul>
  );
};

export default List;
