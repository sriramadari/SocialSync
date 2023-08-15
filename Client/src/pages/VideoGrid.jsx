import React, { useEffect, useRef } from 'react';
import {useParams} from "react-router-dom"
import initializeSocket from '../services/socketconnection';
import { setLocalStream } from '../utils/StreamSetupjs';
import { mediaConstraints } from '../utils/peersetup';
function VideoCallRoom() {

  const { id } = useParams();
  const videoRef = useRef(null);
  const socket = useRef(null); // Reference to the socket instance

  const Connect = async () => {
    socket.current = initializeSocket().connect();
    socket.current.emit('join', id);

    // Handle socket 'room_created' event
    socket.current.on('room_created', async (roomId) => {
      const stream = await setLocalStream(mediaConstraints);
      videoRef.current.srcObject = stream;
    });
  };

  const Disconnect = () => {
    if (socket.current) {
      socket.current.disconnect();
      socket.current = null;
      videoRef.current.srcObject = null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Video Call Room</h1>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-96 h-72 object-cover mb-4"
      />

      <button
        onClick={Connect}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
      >
        Start Connect
      </button>
      <button
        onClick={Disconnect}
        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300 mt-2"
      >
        Disconnect
      </button>
    </div>
  );
}

export default VideoCallRoom;
