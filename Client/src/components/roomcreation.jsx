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
    <div className="flex flex-col items-center p-4">
    <h1 className="text-2xl font-bold mb-4">Create a Room</h1>
    <input type="text" value={roomID} readonly className="w-full py-2 px-4 border rounded-lg mb-4" />
    <button onClick={generateRandomID} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg mb-2">
        Generate Random ID
    </button>
    <button onClick={navigateToRoom} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg">
        Create Room
    </button>
</div>

  );
}

export default RoomCreation;
