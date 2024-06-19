const express = require('express');
const {createServer} = require('http');
const app = express();
const {Server} =require('socket.io')
const PORT = process.env.port || 8000;
const myserver = createServer(app);
const cors = require('cors');
const { join } = require('path');


const io = new Server(myserver,{
    cors:{
        origin:'http://localhost:5173', // FRONTEND URL
        methods:["GET","POST"],//ALLOWED METHODS THAT THE CLIENT CAN MAKE TO THIS SERVER
        credentials:true,//COOKIES, AUTH, HEADERS
    }
});

app.use(cors({
    origin: 'http://localhost:5173', // Your frontend URL
    optionsSuccessStatus: 200 
  }));

app.get('/', (req,res)=>{
    return res.end("Welcome");
})

io.use((socket, next)=>{
    //next();
})

io.on('connection', (socket)=>{
    console.log("User connected, ",socket.id);
    socket.broadcast.emit('BroadcasT', `A new user has joined ${socket.id}`);
    socket.on('message', (x)=>{
        io.to(x.targetroom).emit('received', x);
    })

    socket.on('join_room', (roomName) =>{
        socket.join(roomName);
        console.log(`User joined ${roomName}`);
    })
    socket.on('disconnect', ()=>{
        console.log(socket.id," disconnected");
    })
})
 



myserver.listen(PORT, ()=>{
    console.log("Server is live at ",PORT);
})