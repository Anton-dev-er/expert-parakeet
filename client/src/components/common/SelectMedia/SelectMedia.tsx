import React from 'react';
import YoutubeMedia from '@/src/components/common/SelectMedia/YoutubeMedia/YoutubeMedia';
import ScreenShare from './ScreenShare/ScreenShare';

const SelectMedia = () => {
  return (
    <div>
      <YoutubeMedia />
      <ScreenShare />
    </div>
  );
};

export default SelectMedia;
