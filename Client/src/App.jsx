import React,{useEffect,useState}from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Roomoutlet from './pages/roomoutlet';
import {auth} from "./services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import CreatorRoom from "./pages/CreatorRoom";
import { Room } from './pages/Room';
import { Joinroom } from './components/joinroom';
import JoinOutlet from './pages/joinoutlet';
import RoomJoiner from './pages/RoomJoiner';
export default function App() {
   const [uid, setUid] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
        sessionStorage.setItem("uid",user.uid);
        console.log(user.uid);
      } else {
        setUid(null);
      }
    });
  },[]); 
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/room" element={<Roomoutlet />}>
          <Route index element={<Room/>}></Route>
          <Route path=":id" element={<CreatorRoom/>}></Route>
        </Route>
        <Route path="/joinroom" element={<JoinOutlet/>}>
            <Route index element={<Joinroom/>}/>
            <Route path=":id" element={<RoomJoiner/>}/>
          </Route>
      </Routes>
    </Router>
  )
}
