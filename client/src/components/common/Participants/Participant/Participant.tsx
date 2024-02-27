import React, { FC } from 'react';
import styles from './Participant.module.scss';
import { LOCAL_CLIENT, PeerMediaElement } from '@/src/types/webRTCType';

type HandleVideo = {
  video: HTMLVideoElement | null;
  client: string;
  stream: MediaProvider | null;
};

interface Props {
  clientMedia: PeerMediaElement;
}

const Participant: FC<Props> = ({ clientMedia }) => {
  console.warn('Participant re rendering, clientMedia:', clientMedia.client);
  const handleVideo = ({ video, stream, client }: HandleVideo) => {
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
    <div className={styles.participant}>
      <video
        ref={(video) =>
          handleVideo({ video, client: clientMedia.client, stream: clientMedia.stream })
        }
      />
    </div>
  );
};

export default React.memo(Participant);
