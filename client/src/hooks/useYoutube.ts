'use client';

import useSocketContext from '@/src/hooks/useSocketContext';
import { ACTIONS } from '@/src/contexts/SocketContext';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

const useYoutube = () => {
  const params = useParams<{ userRoomId: string }>();
  const { socket } = useSocketContext();
  const [link, setLink] = useState('');

  const validateLink = (value: string): string => {
    if (value.includes('https://www.youtube.com/embed/')) {
      return value;
    }

    if (value.includes('https://www.youtube.com/')) {
      const url = new URL(value);
      const id = url.searchParams.get('v');

      let newLink = '';
      if (id) {
        newLink = `https://www.youtube.com/embed/${id}?autoplay=1`;
        socket?.emit(ACTIONS.RELAY_YOUTUBE, { link: newLink, roomId: params?.userRoomId });
      }
      return newLink;
    }

    return 'https://www.youtube.com';
  };

  useEffect(() => {
    socket?.on(ACTIONS.RELAY_YOUTUBE, ({ link }) => {
      setLink(link);
    });
    return () => {
      socket?.off(ACTIONS.RELAY_YOUTUBE);
    };
  }, [socket]);

  return {
    link: validateLink(link),
    setLink,
  };
};

export default useYoutube;
