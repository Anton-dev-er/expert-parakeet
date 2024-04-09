import React, { FC } from 'react';
import styles from './Iframe.module.scss';

interface Props {
  src: string;
}

const Iframe: FC<Props> = ({ src }) => {
  return <iframe width="1060" height="600" className={styles.iframe} src={src}></iframe>;
};

export default Iframe;
