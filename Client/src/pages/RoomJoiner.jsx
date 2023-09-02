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
  const [RemoteName, setRemotename] = useState("");
 

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
        setRemotename(event.Name);
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
      rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(event.sdp));
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
      setRemotename("");
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
    <div className="flex flex-row h-screen">
    <div className="p-4 w-2/3 text-white flex flex-col justify-between bg-gray-500">
        <Link to="/joinroom" className="text-black hover:text-gray-200">Back</Link>
        <h1 className="flex flex-row items-center justify-center text-3xl font-semibold my-4">Video Call Room</h1>
        <div className="mb-4 md:flex md:flex-col  items-center justify-center md:justify-between">
          <div className={`w-full mb-2 md:w-1/2 ${window.innerWidth < 768 ? 'md:w-full' : ''}`}>
          <p className={`text-sm ${window.innerWidth < 768 ? 'text-center' : 'text-left'}`}>{RemoteName}</p>
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className={`w-full h-72 object-cover rounded-lg ${window.innerWidth < 768 ? 'mb-4' : ''}`}
            />
          </div>
          <div className={`mb-18 flex flex-row items-center w-full md:w-1/2 md:ml-4 ${window.innerWidth < 768 ? 'mt-4' : ''}`}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className={`items-center h-40 object-cover rounded-lg ${window.innerWidth < 768 ? '' : 'mb-4'}`}
            />
          </div>
      </div>
      <div className="flex flex-row items-center justify-center">
        <button
          onClick={Connect}
          disabled={isButtonClickable}
          className="py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-300 mr-4"
        >
          Start Call
        </button>
        <button
          onClick={Disconnect}
          disabled={!isButtonClickable}
          className="py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300"
        >
          End Call
        </button>
      </div>
    </div>
    <div className="w-1/3 bg-gray-100 p-4">
      <Leftchatbar Id={id} />
    </div>
  </div>
  );
}

export default RoomJoiner;
