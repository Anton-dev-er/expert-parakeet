import React, { FC } from 'react';
import styles from './Item.module.scss';
import { Item } from '@/src/components/UI/List/types';

const Item: FC<Item> = ({ content, ImageComponent,  handleOnClick, position }) => {
  const handleOptions = () => {
    const newClasses = [styles.item];

    if (position === 'center') {
      newClasses.push(styles.center);
    }

    return newClasses.join(' ');
  };

  return (
    <li onClick={handleOnClick} className={handleOptions()}>
      {ImageComponent && <div>{ImageComponent}</div>}
      {content && <p>{content}</p>}
    </li>
  );
};

export default Item;
