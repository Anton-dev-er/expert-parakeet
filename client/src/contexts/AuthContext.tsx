'use client'
import { createContext, FC, ReactNode, useEffect, useState } from 'react'
import { User } from '@/src/types'
import AuthService from '@/src/services/AuthService'

interface AuthContextType {
  auth: boolean
  user: User | null
  login: (email: string, password: string) => Promise<void>
  registration: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export const AuthContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    if (localStorage.getItem('token')) {
      void refresh()
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await AuthService.login(email, password)
      localStorage.setItem('token', response.accessToken)
      setAuth(true)
      setUser(response.user)
    } catch (e) {
      console.log('error:', e)
    }
  }

  const registration = async (email: string, password: string) => {
    try {
      const response = await AuthService.registration(email, password)
      localStorage.setItem('token', response.accessToken)
      setAuth(true)
      setUser(response.user)
    } catch (e) {
      console.log('error:', e)
    }
  }

  const refresh = async () => {
    try {
      const response = await AuthService.refresh()
      localStorage.setItem('token', response.accessToken)
      setAuth(true)
      setUser(response.user)
    } catch (e) {
      console.log('error:', e)
    }
  }

  const logout = async () => {
    try {
      const response = await AuthService.logout()
      console.log('response:', response)
      localStorage.removeItem('token')
      setAuth(false)
      setUser(null)
    } catch (e) {
      console.log('error:', e)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        auth,
        user,
        login,
        registration,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
