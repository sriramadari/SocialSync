import React,{useState} from 'react'
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link ,useNavigate} from 'react-router-dom';
import { auth } from '../services/firebase';
export default function Login() {
  const nav=useNavigate();
  const [field,setfield]=useState({
    email:"",
    password:""
  });
  const handlefields=(e)=>{
  setfield({
    ...field,
    [e.target.name]:e.target.value
  })
  }
  const handleLogin=(e)=>{
    e.preventDefault();
    signInWithEmailAndPassword(auth, field.email, field.password)
    .then((userCredential) => {
      const user = userCredential.user;
      sessionStorage.setItem("uid",user.uid);
      console.log(user);
      nav("/");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
  }

  return (
<div className="flex flex-col items-start justify-start h-screen p-4">
  <Link to="/">Go to Home</Link>
  
  <div className="mt-[90px] max-w-lg mx-auto p-6 bg-white rounded shadow-md">
  <h2 className=" flex flex-col items-center justify-center text-2xl font-semibold mb-4">Login</h2>
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="mb-4">
        <label htmlFor="email" className="block font-medium">
          Email:
        </label>
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={field.email || ""}
          onChange={handlefields}
          className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="password" className="block font-medium">
          Password:
        </label>
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={field.password || ""}
          onChange={handlefields}
          className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
        />
      </div>
      <div>
        <button
          type="submit"
          className="w-full py-2 px-3 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
        >
          Login
        </button>
      </div>
    </form>
    <p className="mt-4">
      New User? <Link to="/signup" className="text-blue-500">Sign Up</Link>
    </p>
  </div>
</div>

  )
}
