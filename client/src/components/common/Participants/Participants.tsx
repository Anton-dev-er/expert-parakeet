import React, { FC, useEffect, useState } from 'react';
import styles from './Participants.module.scss';
import Participant from '@/src/components/common/Participants/Participant/Participant';
import { PeerMediaElement, SCREEN_SHARING } from '@/src/types/webRTCType';
import ScreenShareParticipant from '@/src/components/common/Participants/ScreenShareParticipant/ScreenShareParticipant';

interface Props {
  clientsMedia: PeerMediaElement[];
  localMedia: PeerMediaElement;
}

type ScreenShareClientMedia = PeerMediaElement | undefined;

const Participants: FC<Props> = ({ clientsMedia = [], localMedia }) => {
  const [screenShareClientMedia, setScreenShareClientMedia] = useState<ScreenShareClientMedia>();

  useEffect(() => {
    const screenShareClientMedia = clientsMedia.find(
      (clientMedia) => clientMedia.client === SCREEN_SHARING
    );

    setScreenShareClientMedia(screenShareClientMedia);
  }, [clientsMedia]);

  return (
    <>
      {screenShareClientMedia && (
        <ScreenShareParticipant clientMedia={screenShareClientMedia} key={screenShareClientMedia.stream?.id} />
      )}
      <div className={styles.participants}>
        <Participant clientMedia={localMedia} key={localMedia?.stream?.id} />

        {clientsMedia.map((clientMedia) => {
          if (clientMedia.client === SCREEN_SHARING) {
            return;
          }

          return (
            <Participant
              key={clientMedia.stream?.id || clientMedia?.client}
              clientMedia={clientMedia}
            />
          );
        })}
      </div>
    </>
  );
};

export default Participants;
