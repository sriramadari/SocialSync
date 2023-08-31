import React, { useState, useRef, useEffect } from "react";
import { useParams,Link } from "react-router-dom";
import initializeSocket from "../services/socketconnection";
import {
  setLocalStream,
  addLocalTracks,
  setRemoteStream,
  sendIceCandidate,
  createAnswer,
} from "../utils/StreamSetupjs";
import { mediaConstraints, iceServers } from "../utils/peersetup";
import Leftchatbar from "../components/leftchatbar";
import { name,isRoomCreator } from "../utils/sessionstorage";
function RoomJoiner() {
  const { id } = useParams();
  const videoRef = useRef(null);
  const socket = useRef(null);
  const remoteVideoRef = useRef(null);
  let rtcPeerConnection;
  const Name = name();
  const [isButtonClickable, setIsButtonClickable] = useState(false);

 

  const Connect = async () => {
    socket.current = initializeSocket().connect();
    sessionStorage.setItem("isRoomCreator", false);
    const creator="False";
    let roomId=id;
    socket.current.emit("join", {roomId,creator});
    socket.current.on("offline",()=>{
      alert("Room Creator is Offline,wait until for connection !");
    })
    socket.current.on("room_joined", async (roomId) => {
      const stream = await setLocalStream(mediaConstraints);
      videoRef.current.srcObject = stream;
      setIsButtonClickable(!isButtonClickable);
      socket.current.emit("start_call", {Name,id});
    });

    socket.current.on("webrtc_offer", async (event) => {
      console.log("Socket event callback: webrtc_offer");
      //   if(!isRoomCreator()){
      rtcPeerConnection = new RTCPeerConnection(iceServers);
      const localStream = videoRef.current.srcObject;
      addLocalTracks(localStream, rtcPeerConnection);
      rtcPeerConnection.ontrack = (event) => {
        setRemoteStream(event, remoteVideoRef);
      };
      console.log("1:",rtcPeerConnection);
      rtcPeerConnection.onicecandidate = (event) => {
        sendIceCandidate(socket, id, event);
      };
      rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(event));
      const sdp = await createAnswer(rtcPeerConnection);
      console.log("Answerer sdp: ", sdp);
      socket.current.emit("webrtc_answer", {
        type: "webrtc_answer",
        sdp: sdp,
        roomId: id,
      });
      socket.current.on("webrtc_ice_candidate", (event) => {
        console.log("Socket event callback: webrtc_ice_candidate");
        const candidate = new RTCIceCandidate({
          sdpMLineIndex: event.label,
          candidate: event.candidate,
        });
        rtcPeerConnection.addIceCandidate(candidate);
      });
      console.log(rtcPeerConnection);
      //   }
      socket.current.on("user_disconnected", (event) => {
        alert(event.Name + " disconnected");
        remoteVideoRef.current.srcObject = null;
      });
    });

    socket.current.on("full_room", () => {
      console.log("Socket event callback: full_room");
      alert("The room is full, please try another one");
    });
  };

  const Disconnect = async () => {
    if (socket.current) {
      if (rtcPeerConnection == null) {
        setIsButtonClickable(!isButtonClickable);
        let localStream = videoRef.current.srcObject;
        localStream.getTracks().forEach((track) => track.stop());
        sessionStorage.setItem("isRoomCreator", false);
        videoRef.current.srcObject = null;
        remoteVideoRef.current.srcObject = null;
        socket.current.emit("user_disconnected", { Name, id });
        socket.current.disconnect();
        console.log("disconnected");
      } else {
        setIsButtonClickable(!isButtonClickable);
        let localStream = videoRef.current.srcObject;
        console.log(localStream);
        console.log(rtcPeerConnection);
        rtcPeerConnection.removeStream(localStream);
        // rtcPeerConnection.close();
        localStream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
        console.log(Name, id);
        socket.current.emit("user_disconnected", { Name, id });
        remoteVideoRef.current.srcObject = null;
        socket.current.disconnect();
        console.log("disconnected");
      }
    }
  };

 

  return (
    <>
    <Link to="/joinroom">back</Link>
    <Leftchatbar Id={id} />
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Video Call Room</h1>
        <div className="flex flex-row items-center">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-96 h-72 object-cover mb-4"
          />
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-96 h-72 object-cover mb-4"
          />
        </div>

        <button
          onClick={Connect}
          disabled={isButtonClickable}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
        >
          Start Connect
        </button>
        <button
          onClick={Disconnect}
          disabled={!isButtonClickable}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300 mt-2"
        >
          Disconnect
        </button>
      </div>
      
    </>
  );
}

export default RoomJoiner;
