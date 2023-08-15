import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
function RoomCreation() {
  const nav = useNavigate();
  const [roomID, setRoomID] = useState('');

  const generateRandomID = () => {
    const randomID = Math.floor(Math.random() * 100000).toString();
    setRoomID(randomID);
  };

  const navigateToRoom = () => {
    nav(`/room/${roomID}`);
  };

  return (
    <div>
      <h1>Create a Room</h1>
      <input type="text" value={roomID} readOnly />
      <button onClick={generateRandomID}>Generate Random ID</button>
      <button onClick={navigateToRoom}>Create Room</button>
    </div>
  );
}

export default RoomCreation;
