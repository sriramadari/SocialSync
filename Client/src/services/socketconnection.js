import { io } from 'socket.io-client';

const initializeSocket = () => {
  return io("http://localhost:8080/video"); 
};

export const ToChatSocket=()=>{
  return io("http://localhost:8080/chat"); 
}
export const EditerSocket=()=>{
  return io("http://localhost:8080/Editor"); 
}

export default initializeSocket;
