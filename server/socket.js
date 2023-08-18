const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server,{
  cors:{
    origin: ' http://localhost:5173',
    methods: ['GET', 'POST'],
  }
})


// app.use('/', express.static('public'))
const userSockets = {};

io.on('connection', (socket) => {
  console.log('A user connected with ID:',socket.id);

    socket.on('set_user_id', (Id) => {
      userSockets[Id] = socket;
    });

    socket.on('sending_message', ({ msg, Id }) => {
      if (userSockets[Id]) {
        userSockets[Id].emit('receiving_msg', { msg });
      }
    });
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      const userId = Object.keys(userSockets).find(key => userSockets[key] === socket);
      if (userId) {
        delete userSockets[userId];
      }
    });


  socket.on('join', (roomId) => {
    const roomClients = io.sockets.adapter.rooms.get(roomId);
    const numberOfClients = roomClients ? roomClients.size : 0;
    console.log(numberOfClients);

    // handling room joining
    if (numberOfClients == 0) {
      const message=`Creating room ${roomId} and emitting room_created socket event`;
      console.log(message);
      socket.join(roomId);
      socket.emit('room_created', roomId,message);
    } else if (numberOfClients == 1) {
      console.log(`Joining room ${roomId} and emitting room_joined socket event`);
      socket.join(roomId);
      socket.emit('room_joined', roomId);
    } else {
      console.log(`Can't join room ${roomId}, emitting full_room socket event`);
      socket.emit('full_room', roomId);
    }
  });


  // These events are emitted to all the sockets connected to the same room except the sender.

socket.on("user disconnected",(e)=>{
  console.log("user diconnection broadcasted");
  socket.broadcast.to(e.id).emit('user disconnected',e.name)
})

  socket.on('start_call', (roomId) => {
    console.log(`Broadcasting start_call event to peers in room ${roomId}`)
    socket.broadcast.to(roomId).emit('start_call')
  })
  socket.on('webrtc_offer', (event) => {
    console.log(`Broadcasting webrtc_offer event to peers in room ${event.roomId}`)
    socket.broadcast.to(event.roomId).emit('webrtc_offer', event.sdp)
  })
  socket.on('webrtc_answer', (event) => {
    console.log(`Broadcasting webrtc_answer event to peers in room ${event.roomId}`)
    socket.broadcast.to(event.roomId).emit('webrtc_answer', event.sdp)
  })
  socket.on('webrtc_ice_candidate', (event) => {
    console.log(`Broadcasting webrtc_ice_candidate event to peers in room ${event.roomId}`)
    socket.broadcast.to(event.roomId).emit('webrtc_ice_candidate', event)
  })
  socket.on('disconnect', () => {
    console.log('user with ID ',socket.id,' disconnected:', );
  });
})

const port = process.env.PORT || 8080
server.listen(port, () => {
  console.log(`Express server listening on port ${port}`)
})