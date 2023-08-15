import React, { useEffect } from 'react'
import { useNavigate,Outlet } from 'react-router-dom'
import {uid} from "../utils/sessionstorage";
export default function JoinOutlet() {
  const nav=useNavigate();
  console.log(uid());
  useEffect(()=>{
    if(!uid()){
      nav("/login");
    }
  },[uid])
  return (
    <>
    <Outlet/>
    </>
  )
}
