import { io } from 'socket.io-client';

const initializeSocket = () => {
  return io("https://socialsync-eeuc.onrender.com/video"); 
};

export const ToChatSocket=()=>{
  return io("https://socialsync-eeuc.onrender.com/chat"); 
}

export default initializeSocket;
