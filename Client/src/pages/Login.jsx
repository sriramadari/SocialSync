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
      console.log(user);
      nav("/");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow-md">
  <h2 className="text-2xl font-semibold mb-4">Login</h2>
  <form onSubmit={handleLogin} className="space-y-4">
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
    <button
      type="submit"
      className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
    >
      Sign Up
    </button>
  </form>
  <p className="mt-4">
    New User? <Link to="/signup" className="text-blue-500">Sign Up</Link>
  </p>
</div>

  )
}
