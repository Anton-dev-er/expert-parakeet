'use client'
import React, {useEffect, useState} from 'react'
import Hero from '@/src/components/pages/home/Hero/Hero'
import List from '@/src/components/UI/List/List'
import styles from './Home.module.scss'
import {Item} from '@/src/components/UI/List/types'
import {useRouter} from 'next/navigation'
import {ACTIONS} from '@/src/contexts/SocketContext'
import useSocketContext from '@/src/hooks/useSocketContext'
import {roomHref} from '@/src/utils/room.utils'
import {RoomResponse} from '@/src/types/response/RoomResponse'

const Home = () => {
  const [rooms, setRooms] = useState<string[]>([])
  const [listItems, setListItems] = useState<Item[]>([])
  const {push} = useRouter()
  const {socket} = useSocketContext()

  useEffect(() => {
    if (socket) {
      socket.on(ACTIONS.SHARE_ROOMS, ({rooms = []}) => {
        console.log('on SHARE_ROOMS')
        setRooms(rooms)
      })
    }

    return () => {
      socket?.off(ACTIONS.SHARE_ROOMS)
    }
  }, [socket])

  useEffect(() => {
    const items: Item[] = rooms.map((room): Item => {
      return {
        id: room,
        content: `Room name: ${room}`,
        handleOnClick: () => push(roomHref(room)),
      }
    })
    setListItems(items)
  }, [rooms])

  return (
      <div className={styles.home}>
        <Hero/>

        {/*todo separate in component*/}
        <div style={{margin: '2em'}}>
          <h2>Global public rooms</h2>
          {listItems.length ? <List items={listItems}/> : <h3>Rooms not found</h3>}
        </div>
      </div>
  )
}

export default Home
