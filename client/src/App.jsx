import React, { useEffect, useMemo, useState } from 'react'
import {io} from 'socket.io-client'
import {Button, Container, Stack, TextField, Typography}  from '@mui/material'

const App = () => {
  const socket = useMemo(() =>
    io('http://localhost:8000'),[]);

  const [message, setmessage] = useState();
  const [room, setroom] = useState();
  const [socketid, setsocketid] = useState(null);
  const [allmessages, setallmessages] = useState([]);
  const [chatroom, setchatroom] = useState();


  const handleSubmit = (e)=>{
    e.preventDefault();
    const obj = {
      message:message,
      client_id:socket.id,
      targetroom: room,
    }
    socket.emit('message', obj);
    setmessage('');
  }

  const join_room = (e) =>{
    e.preventDefault();
    socket.emit('join_room', chatroom);
    setchatroom();
  }


  useEffect(()=>{
    socket.on('connect', ()=>{
      setsocketid(socket.id);
    })

    socket.on('BroadcasT', (msg)=>{
      console.log(msg);
    })

    socket.on('received', (obj)=>{
      const msg = obj.message;
      const senderid = obj.client_id;
      const receiverid = obj.targetroom;
      console.log(`${senderid} : ${msg} : ${receiverid}`);
      setallmessages((prev) => [...prev, msg]);
    })
    return () =>{
      socket.disconnect();
    }
  }, []);

  useEffect(()=>{
    console.log(allmessages)
  }, [allmessages]);
  return (
    <Container maxWidth="sm">
      <Typography variant='h1' component="div" >
        Welcome to Socket.io
      </Typography>
      <h1>{socket.id ? socketid : 'Connecting...'}</h1>
      <form onSubmit={handleSubmit}>
      <TextField value={room} onChange={(e) => setroom(e.target.value)} label="room" />
        <TextField value={message} onChange={(e) => setmessage(e.target.value)} label="message" />
          <Button type='submit' color='primary'>Send</Button>
      </form>


      <form onSubmit={join_room}>
        <h3> Join Chat Room</h3>
        <TextField value={chatroom} onChange={(e) => setchatroom(e.target.value)} label="chat room" />
          <Button type='submit' color='primary'>Join Chat Room</Button>
      </form>

      <Stack>
      {allmessages.map((msg, index) => (
          <Typography key={index} variant='h6' component='div' gutterBottom>
            {msg}
          </Typography>
        ))}
      </Stack>
    </Container>
  )
}

export default App