import React, { FC } from "react";
import styles from "./Item.module.scss";
import { Item } from "@/src/components/UI/List/types";

const Item: FC<Item> = ({ content, ImageComponent, id, handleOnClick }) => {
  return (
    <li onClick={handleOnClick} className={`${styles.item}`} id={id}>
      {ImageComponent && <div>{ImageComponent}</div>}
      <p>{content}</p>
    </li>
  );
};

export default Item;
