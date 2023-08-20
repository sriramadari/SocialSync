import React, { useState, useEffect, useRef } from 'react';
import Message from './Message';
import initializeSocket from '../services/socketconnection';
import { name } from '../utils/sessionstorage';

const Leftchatbar = ({ Id }) => {
  const [msg, setMsg] = useState('');
  const [messages, setMessages] = useState([]);
  const Name = name();
  const socket=useRef();

  useEffect(() => {
    socket.current = initializeSocket().connect();
    // socket.current.emit('join_room', Id);

    socket.current.on('receive_msg', (event) => {
      const receivedMessage = event.msg;
      const receivedSender = event.Name;
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: receivedMessage, sender: receivedSender, isSent: false },
      ]);
    });

    return () => {
      socket.current.disconnect();
    };
  }, [Id]);

  const handleSend = () => {
    if (msg.trim() !== '') {
      socket.current.emit('send_msg', { msg, Id, Name });
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: msg, sender: 'You', isSent: true },
      ]);
      setMsg('');
    }
  };

  const handleMessage = (e) => {
    setMsg(e.target.value);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto px-4 py-2">
        {messages.map((message, index) => (
          <Message
            key={index}
            text={message.text}
            sender={message.sender}
            isSent={message.isSent}
          />
        ))}
      </div>
      <div className="flex items-center px-4 py-2 border-t">
        <input
          type="text"
          name="message"
          placeholder="Type any message..."
          className="flex-grow px-2 py-1 border rounded"
          onChange={handleMessage}
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
  );
};

export default Leftchatbar;
