import { io } from 'socket.io-client';

// const initializeSocket = () => {
//   return io("http://localhost:8080/video"); 
// };

// export const ToChatSocket=()=>{
//   return io("http://localhost:8080/chat"); 
// }
// export const EditerSocket=()=>{
//   return io("http://localhost:8080/Editor"); 
// }
const initializeSocket = () => {
  return io("https://socialsync-eeuc.onrender.com/video"); 
};

export const ToChatSocket=()=>{
  return io("https://socialsync-eeuc.onrender.com/chat"); 
}
export const EditerSocket=()=>{
  return io("https://socialsync-eeuc.onrender.com/Editor"); 
}


export default initializeSocket;
