import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Input from '@/src/components/UI/Input/Input';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import styles from './YoutubeMedia.module.scss';
import Iframe from '@/src/components/UI/Iframe/Iframe';
import useYoutube from '@/src/hooks/useYoutube';

const YoutubeMedia = () => {
  const [show, setShow] = useState(false);
  const { setLink, link } = useYoutube();
  useEffect(() => {
    if (link && link !== 'https://www.youtube.com/embed/' && link !== 'https://www.youtube.com/') {
      setShow(true);
    }
  }, [link]);

  return (
    <>
      <FontAwesomeIcon
        icon={faYoutube}
        onClick={() => setShow(!show)}
        size="2x"
        cursor="pointer"
        color={show ? 'red' : 'black'}
      />
      <div className={styles.youtubeMedia}>
        {show && (
          <div className={styles.youtubeMediaContainer}>
            <Iframe src={link} />
            <Input id="youtube-link" label="Youtube link" onChange={(value) => setLink(value)} />
          </div>
        )}
      </div>
    </>
  );
};

export default YoutubeMedia;
