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
    <div className="flex flex-col items-center justify-center h-screen">
          <h2 className=" flex items-center text-2xl justify-center font-semibold mb-4">Sign Up</h2>
    <div className="max-w-lg mx-auto">
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSignup}>
        <div className="mb-4">
          <label htmlFor="name" className="block font-medium">
            Name:
          </label>
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={field.name || ""}
            onChange={handlefields}
            className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
          />
        </div>
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
        <div className="mb-6">
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
            Sign Up
          </button>
        </div>
      </form>
      <p className="text-center text-gray-500 text-sm">
        Already have an account? <Link to="/login" className="text-blue-500 hover:text-blue-800">Log In</Link>
      </p>
    </div>
  </div>
  
  )
}
