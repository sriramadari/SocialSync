import { io } from 'socket.io-client';

const initializeSocket = () => {
  return io("http://localhost:8080"); 
};

export default initializeSocket;