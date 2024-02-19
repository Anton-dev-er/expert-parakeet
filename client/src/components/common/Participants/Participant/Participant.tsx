import React, { FC } from 'react';
import styles from './Participant.module.scss';
import { LOCAL_CLIENT, PeerMediaElement } from '@/src/types/webRTCType';

interface Props {
  clientMedia: PeerMediaElement;
}

const Participant: FC<Props> = ({ clientMedia }) => {
  const handleVideo = (video: HTMLVideoElement | null, client: string, stream: MediaProvider) => {
    if (video) {
      video.srcObject = stream;
      video.autoplay = true;
      if (client === LOCAL_CLIENT) {
        video.volume = 0;
        video.muted = true;
      }
    }
  };

  return (
    <div className={styles.participant} key={clientMedia.client}>
      <video ref={(video) => handleVideo(video, clientMedia.client, clientMedia.stream)}></video>
    </div>
  );
};

export default Participant;
