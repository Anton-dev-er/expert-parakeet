const roomHref = (roomUrl: string, userRoomId: string) => {
  return `/room/${roomUrl}/${userRoomId}`;
};

const isValidRoomName = (str: string) => {
  // allowed letter, numbers, spaces and '-', '_'
  const re = /^[a-zA-Z\s0-9_-]*$/;
  return re.test(str);
};

export { roomHref, isValidRoomName };
