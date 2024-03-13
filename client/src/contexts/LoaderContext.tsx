'use client';

import React, { ReactNode, createContext, useState, FC } from 'react';

interface LoaderContextType {
  isLoading: boolean;
  setLoader: (value: boolean) => void;
}

export const LoaderContext = createContext<LoaderContextType>({} as LoaderContextType);

export const LoaderContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  const setLoader = (value: boolean) => {
    setIsLoading(value);
  };

  return (
    <LoaderContext.Provider value={{ isLoading, setLoader }}>{children}</LoaderContext.Provider>
  );
};
