import React from 'react';

const Message = ({ text, sender, isSent }) => {
  const messageClass = isSent ? 'text-red-600' : 'text-blue-600';
  return (
    <div className={`mb-2 ${isSent ? 'text-right' : ''}`}>
      <strong className={messageClass}>
        {isSent ? 'You' : sender}:
      </strong>{' '}
      <span>{text}</span>
    </div>
  );
};

export default Message;
