import React, { FC } from 'react';
import styles from './Modal.module.scss';

interface ModalProps {
  children: React.ReactNode;
  open: boolean;
  header: string;
  handleOnClose: () => void;
}

const Modal: FC<ModalProps> = ({ children, open, handleOnClose, header }) => {
  return (
    <div className={styles.modal} style={{ display: open ? 'block' : 'none' }}>
      <div className={styles.content}>
        <div className={styles.header}>
          <span onClick={handleOnClose} className={styles.close}>
            &times;
          </span>
          <h2>{header}</h2>
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
