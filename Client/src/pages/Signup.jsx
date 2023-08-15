import React,{useState} from 'react'
import { Link ,useNavigate} from 'react-router-dom';
import {auth,db} from "../services/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
export default function Signup() {
  const nav=useNavigate();
const [field,setfield]=useState({
  name:"",
  email:"",
  password:""
});
const handlefields=(e)=>{
setfield({
  ...field,
  [e.target.name]:e.target.value
})
}
const handleSignup=(e)=>{
  e.preventDefault();
  createUserWithEmailAndPassword(auth, field.email, field.password)
  .then(async(userCredential) => {
    const user = userCredential.user;
    console.log(user);
    const userId=user.uid;
    const name=field.name;
    const email=field.email;
    writeUserData(userId,name,email);
    nav("/login");
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  });
}

function writeUserData(userId,name, email) {
  set(ref(db, 'users/' + userId), {
    username: name,
    email: email
  }).then(() => {
    console.log("User data saved successfully!");
  })
  .catch((error) => {
    console.error("Error saving user data:", error);
})}
  return (
    <div className="w-full max-w-xs mx-auto">
    <h2 className="text-2xl font-semibold mb-4">Sign Up</h2>
    <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSignup}>
      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
          Name:
        </label>
        <input
          type="text"
          placeholder="name"
          name="name"
          value={field.name || ""}
          onChange={handlefields}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
          Email:
        </label>
        <input
          type="email"
          placeholder="email"
          name="email"
          value={field.email || ""}
          onChange={handlefields}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-6">
        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
          Password:
        </label>
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={field.password || ""}
          onChange={handlefields}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Sign Up
        </button>
      </div>
    </form>
    <p className="text-center text-gray-500 text-sm">
      Already have an account? <Link to="/login" className="text-blue-500 hover:text-blue-800">Log In</Link>
    </p>
  </div>  
  )
}
