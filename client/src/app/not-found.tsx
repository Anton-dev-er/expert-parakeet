'use client';
import { redirect } from 'next/navigation';
import React, { useEffect } from 'react';

const NotFound = () => {
  useEffect(() => {
    redirect('/home');
  }, []);
  return <h1 style={{ color: 'black' }}>404 - Page Not Found</h1>;
};

export default NotFound;
