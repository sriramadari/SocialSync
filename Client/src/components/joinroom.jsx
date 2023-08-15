import React ,{useState}from 'react'
import { Header } from './header'
import { useNavigate } from 'react-router-dom'
export const Joinroom = () => {
    const nav=useNavigate();
    const [roomID, setRoomID] = useState('');
  const navigateToJoinRoom = () => {
    nav(`/joinroom/${roomID}`);
  };
  return (
    <>
    <Header/>
    <div className="flex flex-col items-center p-4">
    <h1 className="text-2xl font-bold mb-4">Join Room</h1>
    <input type="text" onChange={(e)=>setRoomID(e.target.value)} placeholder="Enter RoomID... " className="w-55 py-2 px-4 border rounded-lg mb-4" />
    <button onClick={navigateToJoinRoom} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg">
        Join Room
    </button>
</div>

    </>
  )
}
