import React, { useState,useRef ,useEffect} from 'react'
import initializeSocket from '../services/socketconnection';
import { name } from "../utils/sessionstorage";
export const Leftchatbar = (Id) => {
  const [msg,setmsg]=useState("");
  const [rmsg,setrmsg]=useState([]);
  const socket = useRef(null); 
  const Name=name();
  useEffect(() => {
    socket.current = initializeSocket().connect(); 
    socket.current.emit('join_room', Id); 
    socket.current.on('receive_msg', (event) => {
      setrmsg((prev)=>[...prev,event]);
      console.log('Message received');
    });
    return () => {
      // socket.current.emit("leave_room",Id);
      socket.current.disconnect();
    };
  }, [Id]);

  const handleSend = () => {
    if (msg.trim() !== '') {
    socket.current.emit('send_msg', { msg, Id ,Name});
    setmsg("");
    console.log('Message sent');
    }
  };
  return (
    <> <div className="flex flex-col h-full">
    <div className="flex-grow overflow-y-auto px-4 py-2">
      {rmsg.map((smsg, index) => (
        <div key={index} className="mb-2">
          <strong className="text-blue-600">{smsg.Name}: </strong>
          {smsg.msg}
        </div>
      ))}
    </div>
    <div className="flex items-center px-4 py-2 border-t">
      <input
        type="text"
        name="message"
        placeholder="Type any message..."
        className="flex-grow px-2 py-1 border rounded"
        onChange={(e) => { setmsg(e.target.value) }}
        value={msg}
      />
      <button
        className="ml-2 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        onClick={handleSend}
      >
        Send
      </button>
    </div>
  </div>
  
    </>
  )
}
