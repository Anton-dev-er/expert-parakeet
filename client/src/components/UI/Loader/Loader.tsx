import React from 'react';
import style from './Loader.module.scss';

const Loader = () => {
  return <progress className={style.loader}></progress>;
};

export default Loader;
