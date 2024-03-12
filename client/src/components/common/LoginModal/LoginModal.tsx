'use client';
import React, { useState } from 'react';
import Modal from '@/src/components/UI/Modal/Modal';
import Input from '@/src/components/UI/Input/Input';
import Button from '@/src/components/UI/Button/Button';
import useAuthContext from '@/src/hooks/useAuthContext';
import Loader from '../../UI/Loader/Loader';
import useLoader from '@/src/hooks/useLoader';

// todo remove this component
const LoginModal = () => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [switchToRegister, setSwitchToRegister] = useState(false);
  const { login, registration } = useAuthContext();
  const { isLoading, setIsLoading } = useLoader();

  const handleOnOpen = () => {
    setOpen(true);
  };

  const handleOnClose = () => {
    setOpen(false);
  };

  const handleLogin = async () => {
    setIsLoading(true);
    if (switchToRegister) {
      await registration(email, password);
    } else {
      await login(email, password);
    }
    setIsLoading(false);
  };

  return (
    <div style={{ marginBottom: '1em' }}>
      <Button onClick={handleOnOpen}>Log in</Button>
      <Modal
        open={open}
        handleOnClose={handleOnClose}
        header={switchToRegister ? 'Register' : 'Log in'}
      >
        <div>
          <Input
            id="email"
            label="Email"
            onChange={(value) => {
              setEmail(value);
            }}
          />
          <Input
            id="password"
            label="Password"
            type="password"
            onChange={(value) => {
              setPassword(value);
            }}
          />
          <Button onClick={handleLogin}>{switchToRegister ? 'Register' : 'Log in'}</Button>
          <Button type="outlined" onClick={() => setSwitchToRegister(!switchToRegister)}>
            {switchToRegister ? 'Go to log in' : 'Go to register'}
          </Button>
        </div>
      </Modal>
      {isLoading && <Loader />}
    </div>
  );
};

export default LoginModal;
