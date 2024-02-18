'use client';
import { useContext } from 'react';
import { AuthContext } from '@/src/contexts/AuthContext';

const useAuthContext = () => useContext(AuthContext);

export default useAuthContext;
