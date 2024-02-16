'use client'
import { useContext } from 'react'
import { SocketContext } from '@/src/contexts/SocketContext'

const useSocketContext = () => useContext(SocketContext)

export default useSocketContext
