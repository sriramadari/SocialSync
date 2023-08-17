import React, { useState,useRef ,useEffect} from 'react'
import initializeSocket from '../services/socketconnection';
export const Leftchatbar = (Id) => {
  const [msg,setmsg]=useState("");
  const [rmsg,setrmsg]=useState("");
  const socket = useRef(null); 
  useEffect(() => {
    socket.current = initializeSocket().connect(); 
    socket.current.emit('set_user_id', Id); 
    socket.current.on('receiving_msg', (event) => {
      setrmsg(event.msg);
      console.log('Message received');
    });
    return () => {
      socket.current.disconnect();
    };
  }, [Id]);

  const handleSend = () => {
    socket.current.emit('sending_message', { msg, Id });
    console.log('Message sent');
  };
  return (
    <><p id="displaymsg">{rmsg}</p>
      <input type="text" name="message" placeholder='type any message...' onChange={(e)=>{setmsg(e.target.value)}} value={msg}/>
<button onClick={handleSend}>send</button>
    </>
  )
}
