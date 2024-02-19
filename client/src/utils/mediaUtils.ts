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

const getUserMedia = async () => {
  return await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  });
};


export { getAudioTrack, getVideoTrack, getUserMedia};
