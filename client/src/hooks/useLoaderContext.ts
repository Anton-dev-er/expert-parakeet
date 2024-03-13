'use client';
import { useContext } from 'react';
import { LoaderContext } from '@/src/contexts/LoaderContext';

const useLoaderContext = () => useContext(LoaderContext);

export default useLoaderContext;
