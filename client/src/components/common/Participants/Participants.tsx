import React, { FC } from 'react';
import styles from './Participants.module.scss';
import Participant from '@/src/components/common/Participants/Participant/Participant';
import { PeerMediaElement } from '@/src/types/webRTCType';

interface Props {
  clientsMedia: PeerMediaElement[];
  localMedia: PeerMediaElement;
}

const Participants: FC<Props> = ({ clientsMedia, localMedia }) => {

  clientsMedia = clientsMedia || [];
  return (
    <div className={styles.participants}>
      <Participant clientMedia={localMedia} key={localMedia?.stream?.id} />
      {clientsMedia.map((clientMedia) => {
        return <Participant key={clientMedia.stream?.id || clientMedia?.client} clientMedia={clientMedia} />;
      })}
    </div>
  );
};

export default Participants;
