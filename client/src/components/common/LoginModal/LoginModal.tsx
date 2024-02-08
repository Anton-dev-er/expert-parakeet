'use client'
import React, { useState } from 'react'
import Modal from '@/src/components/UI/Modal/Modal'
import Button from '@/src/components/UI/Button/Button'
import useAuthContext from '@/src/hooks/useAuthContext'

// todo remove this component
const LoginModal = () => {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [switchToRegister, setSwitchToRegister] = useState(false)
  const { login, registration } = useAuthContext()

  const handleOnOpen = () => {
    setOpen(true)
  }

  const handleOnClose = () => {
    setOpen(false)
  }

  const handleLogin = async () => {
    if (switchToRegister) {
      await registration(email, password)
    } else {
      await login(email, password)
    }
  }

  return (
    <div style={{marginBottom: "1em"}}>
      <Button onClick={handleOnOpen}>Log in</Button>
      <Modal
        open={open}
        handleOnClose={handleOnClose}
        header={switchToRegister ? 'Register' : 'Log in'}
      >
        <div>
          <input
            autoComplete="one-time-code"
            type="email"
            placeholder="email"
            onChange={(e) => {
              setEmail(e.target.value)
            }}
          />
          <input
            autoComplete="one-time-code"
            type="password"
            placeholder="password"
            onChange={(e) => {
              setPassword(e.target.value)
            }}
          />
          <button onClick={handleLogin}>{switchToRegister ? 'Register' : 'Log in'}</button>
        </div>
        <div>
          <button onClick={() => setSwitchToRegister(!switchToRegister)}>
            {switchToRegister ? 'Go to log in' : 'Go to register'}
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default LoginModal