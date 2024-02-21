const getAudioTrack = (media: MediaStream | null): MediaStreamTrack | null => {
  if (!media) {
    return null;
  }
  const tracks = media.getTracks();
  const track = tracks.filter((track) => track.kind === 'audio');
  if (track.length > 1) {
    console.warn('something wrong, check it out');
  }
  return track.length ? track[0] : null;
};

const getVideoTrack = (media: MediaStream | null): MediaStreamTrack | null => {
  if (!media) {
    return null;
  }
  const tracks = media.getTracks();
  const track = tracks.filter((track) => track.kind === 'video');
  if (track.length > 1) {
    console.warn('something wrong, check it out');
  }
  return track.length ? track[0] : null;
};

const getUserMedia = async (audio: boolean, video: boolean) => {
  try {
    return await navigator.mediaDevices.getUserMedia({
      audio: audio,
      video: video,
    });
  } catch {
    return null;
  }

};


export { getAudioTrack, getVideoTrack, getUserMedia };
