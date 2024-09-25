import React, { FC } from 'react';
import { PeerMediaElement } from '@/src/types/webRTCType';
import Participant from '@/src/components/common/Participants/Participant/Participant';
import styles from './ScreenShareParticipant.module.scss';

interface Props {
  clientMedia: PeerMediaElement;
}

const ScreenShareParticipant: FC<Props> = ({ clientMedia }) => {
  return (
    <div className={styles.screenShareParticipant}>
      <Participant clientMedia={clientMedia} key={clientMedia?.stream?.id} />
    </div>
  );
};

export default ScreenShareParticipant;
