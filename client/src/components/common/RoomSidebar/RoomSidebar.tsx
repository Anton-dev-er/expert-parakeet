'use client';
import React, { useEffect, useState } from 'react';
import styles from './RoomSidebar.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faVideo,
  faVideoSlash,
  faMicrophoneSlash,
  faMicrophone,
} from '@fortawesome/free-solid-svg-icons';
import useRoomContext from '@/src/hooks/useRoomContext';
import { getAudioTrack, getVideoTrack } from '@/src/utils/mediaUtils';

const RoomSidebar = () => {
  const { localMedia, switchAudioOrVideo } = useRoomContext();
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);

  const handleVideo = () => {
    const track = getVideoTrack(localMedia);
    if (track && videoEnabled) {
      track.stop();
      void switchAudioOrVideo(audioEnabled, false);
    } else {
      void switchAudioOrVideo(audioEnabled, true);
    }

    setVideoEnabled(!videoEnabled);
  };

  const handleAudio = () => {
    const track = getAudioTrack(localMedia);
    if (track && audioEnabled) {
      track.stop();
      void switchAudioOrVideo(false, videoEnabled);
    } else {
      void switchAudioOrVideo(true, videoEnabled);
    }
    setAudioEnabled(!audioEnabled);
  };

  useEffect(() => {
    if (localMedia) {
      const tracks = localMedia.getTracks();
      tracks.forEach((track) => {
        if (track.kind === 'audio') {
          setAudioEnabled(true);
        }

        if (track.kind === 'video') {
          setVideoEnabled(true);
        }
      });
    }
  }, [localMedia]);

  return (
    <div className={styles.roomSidebar}>
      <div className={styles.options}>
        <FontAwesomeIcon
          fixedWidth={true}
          size={'2x'}
          icon={audioEnabled ? faMicrophone : faMicrophoneSlash}
          onClick={handleAudio}
        />
        <FontAwesomeIcon
          fixedWidth={true}
          size={'2x'}
          icon={videoEnabled ? faVideo : faVideoSlash}
          onClick={handleVideo}
        />
      </div>
    </div>
  );
};

export default RoomSidebar;
