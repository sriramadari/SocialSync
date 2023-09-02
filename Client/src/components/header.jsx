import React, { useEffect, useState,useRef } from "react";
import { db } from "../services/firebase";
import { ref, child, get } from "firebase/database";
import {uid} from "../utils/sessionstorage";
import { Link } from "react-router-dom";
export const Header = () => {
    const dbRef = useRef(ref(db));
  const [name, setName] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await get(child(dbRef.current, `users/${uid()}`));
        if (snapshot.exists()) {
          console.log(snapshot.val().username);
          sessionStorage.setItem("name",snapshot.val().username);
          setName(snapshot.val().username);
        } else {
          console.log("No data available");
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return <div className="flex flex-row items-start p-4 bg-blue-500">
  <Link to="/" className="text-black hover:text-blue-700 mt-2">Back</Link>
  <div className="flex-grow flex items-center justify-center">
    <header className="text-3xl font-semibold text-center">Hello, {name}</header>
  </div>
</div>

};
