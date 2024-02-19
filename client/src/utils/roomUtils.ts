const roomHref = (userRoomId: string) => {
  return `/room/${userRoomId}`;
};

const isValidRoomName = (str: string) => {
  // allowed letter, numbers, spaces and '-', '_'
  const re = /^[a-zA-Z\s0-9_-]*$/;
  return re.test(str);
};

export { roomHref, isValidRoomName };
