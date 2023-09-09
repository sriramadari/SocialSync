import React from 'react';
import { Link } from 'react-router-dom';
import { signOut } from "firebase/auth";
import { auth } from '../services/firebase';
import { uid,name,isRoomCreator} from '../utils/sessionstorage';

function Home() {
  const handleLogout=()=>{
    signOut(auth).then(() => {
      console.log("user logged out");
      sessionStorage.removeItem("uid");
      sessionStorage.removeItem("name");
      sessionStorage.removeItem("isRoomCreator");
    }).catch((error) => {
      console.log(error);
    });

  }

  return (
    <div className="flex h-screen justify-center items-center bg-gray-600">
      <div className="text-center">
        <h1 className="text-7xl font-bold text-white mb-10 -mt-20">SocialSync</h1>
        <ul className="list-none flex flex-col items-center">
          {uid()?<li className="mb-2">
          <button
             onClick={handleLogout}
              className="bg-white text-blue-500 hover:text-blue-700 mt-2 px-4 py-2 rounded-lg block w-40 text-center"
            >
              Logout
            </button>
          </li>:<li className="mb-2">
          <Link
              to="/login"
              className="bg-white text-blue-500 hover:text-blue-700 mt-2 px-4 py-2 rounded-lg block w-40 text-center"
            >
              Login
            </Link>
          </li>}
          <li className='mt-2'>
            <Link
              to="/room"
              className="bg-white text-blue-500 hover:text-blue-700 mt-2 px-4 py-2 rounded-lg block w-40 text-center"
            >
              Create Room
            </Link>
          </li>
          <li className='mt-2'>
            <Link
              to="/joinroom"
              className="bg-white text-blue-500 hover:text-blue-700 mt-2 px-4 py-2 rounded-lg block w-40 text-center"
            >
              Join Room
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Home;
