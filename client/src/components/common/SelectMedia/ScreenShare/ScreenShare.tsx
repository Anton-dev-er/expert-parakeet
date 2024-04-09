import React from 'react';
import useRoomContext from '@/src/hooks/useRoomContext';
import style from './ScreenShare.module.scss';

const ScreenShare = () => {
  const { videoRef } = useRoomContext();

  return (
    <div>
      <header className={style.screenMedia}>
        <video ref={videoRef} width={1060} height={600} autoPlay playsInline />
      </header>
    </div>
  );
};

export default ScreenShare;
