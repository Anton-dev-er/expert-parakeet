import React, { FC, useEffect } from 'react';
import styles from './Participants.module.scss';
import Participant from '@/src/components/common/Participants/Participant/Participant';
import { PeerMediaElement } from '@/src/types/webRTCType';

interface Props {
  clientsMedia: PeerMediaElement[];
}

const Participants: FC<Props> = ({ clientsMedia }) => {

  useEffect(() => {
    console.log("use effect, clientsMedia:", clientsMedia);
  }, [clientsMedia]);

  return (
    <div className={styles.participants}>
      {clientsMedia.map((clientMedia) => {
        return <Participant key={clientMedia.client} clientMedia={clientMedia} />;
      })}
    </div>
  );
};

export default Participants;