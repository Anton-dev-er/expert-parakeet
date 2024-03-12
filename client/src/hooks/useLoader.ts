import { useState } from 'react';

const useLoader = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return { isLoading, setIsLoading };
};

export default useLoader;
