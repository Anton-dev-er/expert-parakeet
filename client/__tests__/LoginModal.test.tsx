import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import LoginModal from '@/src/components/common/LoginModal/LoginModal';
import { AuthContext } from '@/src/contexts/AuthContext';
import { User } from '@/src/types';
import { LoaderContext } from '@/src/contexts/LoaderContext';

describe('LoginModal', () => {
  test('renders button', async () => {
    render(<LoginModal />);
    const button = screen.getByRole('button', { name: /log in/i });

    expect(button).toBeInTheDocument();
  });

  test('model not rendered', async () => {
    render(<LoginModal />);
    const modalHeading = screen.queryByRole('heading', { name: /log in/i, level: 2 });
    expect(modalHeading).not.toBeInTheDocument();
  });

  test('renders modal', async () => {
    render(<LoginModal />);
    const button = screen.getByRole('button', { name: /log in/i });

    fireEvent.click(button);

    const modalHeading = screen.getByRole('heading', { name: /log in/i, level: 2 });
    expect(modalHeading).toBeInTheDocument();
  });

  test('test login', async () => {
    const login = jest.fn();
    const setLoader = jest.fn();
    render(
      <AuthContext.Provider
        value={{
          auth: false,
          user: {} as User,
          login,
          registration: jest.fn(),
          logout: jest.fn(),
        }}
      >
        <LoaderContext.Provider value={{ isLoading: false, setLoader }}>
          <LoginModal />
        </LoaderContext.Provider>
      </AuthContext.Provider>
    );
    const button = screen.getByRole('button', { name: /log in/i });

    fireEvent.click(button);

    const email = document.querySelector('#email') as HTMLInputElement;
    const password = document.querySelector('#password') as HTMLInputElement;

    expect(email).toBeInTheDocument();
    expect(password).toBeInTheDocument();

    const buttons = screen.getAllByRole('button', { name: /log in/i });
    fireEvent.click(buttons[1]);
    expect(login).toHaveBeenCalledTimes(1);
  });
  test('test register', async () => {
    const registration = jest.fn();
    const setLoader = jest.fn();
    render(
      <AuthContext.Provider
        value={{
          auth: false,
          user: {} as User,
          login: jest.fn(),
          registration,
          logout: jest.fn(),
        }}
      >
        <LoaderContext.Provider value={{ isLoading: false, setLoader }}>
          <LoginModal />
        </LoaderContext.Provider>
      </AuthContext.Provider>
    );
    const button = screen.getByRole('button', { name: /log in/i });
    fireEvent.click(button);
    const buttonGoToRegister = screen.getByRole('button', { name: /Go to register/i });
    fireEvent.click(buttonGoToRegister);

    const email = document.querySelector('#email') as HTMLInputElement;
    const password = document.querySelector('#password') as HTMLInputElement;

    expect(email).toBeInTheDocument();
    expect(password).toBeInTheDocument();

    const buttonRegister = screen.getByRole('button', { name: /register/i });
    fireEvent.click(buttonRegister);
    expect(registration).toHaveBeenCalledTimes(1);
  });
});
