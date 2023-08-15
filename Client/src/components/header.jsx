import React, { useEffect, useState,useRef } from "react";
import { db } from "../services/firebase";
import { ref, child, get } from "firebase/database";
import {uid} from "../utils/sessionstorage";
export const Header = () => {
    const dbRef = useRef(ref(db));
  const [name, setName] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await get(child(dbRef.current, `users/${uid}`));
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

  return <header>Hello,{name}</header>;
};
