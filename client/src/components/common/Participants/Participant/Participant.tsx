import React, { FC } from 'react';
import styles from './Participant.module.scss';
import { LOCAL_CLIENT, PeerMediaElement } from '@/src/types/webRTCType';
import useAuthContext from '@/src/hooks/useAuthContext';

type HandleVideo = {
  video: HTMLVideoElement | null;
  client: string;
  stream: MediaProvider | null;
};

interface Props {
  clientMedia: PeerMediaElement;
}

const Participant: FC<Props> = ({ clientMedia }) => {
  const { user } = useAuthContext();
  console.warn('Participant re rendering, clientMedia:', clientMedia?.client);
  const handleVideo = ({ video, stream, client }: HandleVideo) => {
    if (video) {
      video.srcObject = stream;
      video.autoplay = true;
      // TODO: Once handleVideo starts have a function that syncronizes video for all of people
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
          handleVideo({ video, client: clientMedia?.client, stream: clientMedia?.stream })
        }
        autoPlay
        playsInline
      />
    </div>
  );
};

export default React.memo(Participant);
