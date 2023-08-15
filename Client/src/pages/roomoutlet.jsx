import React, { useEffect } from 'react'
import { Header } from '../components/header'
import { useNavigate,Outlet } from 'react-router-dom'
import {uid as token} from "../utils/sessionstorage";
export default function Roomoutlet() {
  const nav=useNavigate();
  console.log(token);
  useEffect(()=>{
    if(!token){
      nav("/login");
    }
  },[token])
  return (
    <>
    <Outlet/>
    </>
  )
}
