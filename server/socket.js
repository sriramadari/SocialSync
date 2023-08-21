const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server,{
  cors:{
    origin: ' http://localhost:5173',
    methods: ['GET', 'POST'],
  }
})
// const redisAdapter = require('socket.io-redis');

// io.adapter(redisAdapter({ host: 'localhost', port: 6379 }));

// app.use('/', express.static('public'))
const chatSocket=io.of("/chat");
const videosocket=io.of("/video");
const activeRooms = {};

chatSocket.on('connection',(socket)=>{
  console.log('user is chatting with ID:',socket.id);

    socket.on('join_room', (Id) => {
      socket.join(Id);
      if(!activeRooms[Id]){
        activeRooms[Id]=[];
      }
      activeRooms[Id].push(socket.id);
      chatSocket.to(Id).emit('user_joined')
      console.log(activeRooms);
    });
     socket.on('send_msg', ({ msg, Id, Name }) => {
      console.log({ msg, Id, Name });
      console.log(activeRooms);
      socket.to(Id).emit('receive_msg', { msg, Id, Name });
    });
})

const numberOfClients={};
videosocket.on('connection', (socket) => {
  
console.log('A user video with ID:',socket.id);

  socket.on('join', (roomId) => {
  
    if (!numberOfClients[roomId]) {
      numberOfClients[roomId]=[];
      numberOfClients[roomId].push(socket.id);
      console.log(numberOfClients);
      const message=`Creating room ${roomId} and emitting room_created socket event`;
      socket.join(roomId);
      socket.emit('room_created', roomId,message);
    } else if(numberOfClients[roomId].length==1){
      numberOfClients[roomId].push(socket.id);
      console.log(`Joining room ${roomId} and emitting room_joined socket event`);
      socket.join(roomId);
      socket.emit('room_joined', roomId);
    }else{
      console.log("room fulll");
      socket.emit('full_room', roomId);
    }
  });


  // These events are emitted to all the sockets connected to the same room except the sender.

socket.on("user_disconnected",(e)=>{
  console.log("user disconnection broadcasted",e);
  for (const roomId in numberOfClients) {
    const index = numberOfClients[roomId].indexOf(socket.id);
    if (index !== -1) {
      numberOfClients[roomId].splice(index, 1);
      console.log(`Client disconnected from room ${roomId}. ${numberOfClients[roomId].length} clients remaining.`);
      if (numberOfClients[roomId].length === 1) {
        // Emit user_disconnected event to the remaining user
        videosocket.to(roomId).emit('user_disconnected', roomId);
      } else if (numberOfClients[roomId].length === 0) {
        // Delete room if no clients are left
        delete numberOfClients[roomId];
        console.log(`Room ${roomId} has no clients, deleting`);
      }
      
      break; // Exit loop after finding and processing the room
    }
  }
  // console.log(numberOfClients);
  // socket.broadcast.to(e.id).emit('user_disconnected',e.Name)
})

  socket.on('start_call', (event) => {
    console.log(`Broadcasting start_call event to peers in room ${event.id}`);
socket.broadcast.to(event.id).emit('start_call',event.Name)
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