import React, { useEffect, useRef } from 'react';
import {useParams} from "react-router-dom"
import initializeSocket from '../services/socketconnection';
import { setLocalStream,addLocalTracks ,setRemoteStream,sendIceCandidate,createOffer}from '../utils/StreamSetupjs';
import { mediaConstraints ,iceServers} from '../utils/peersetup';
import { isRoomCreator } from '../utils/sessionstorage';
function CreatorRoom() {

  const { id } = useParams();
  const videoRef = useRef(null);
  const socket = useRef(null); 
  const remoteVideoRef = useRef(null);

  const Connect = async () => {
    socket.current = initializeSocket().connect();
    socket.current.emit('join', id);
    socket.current.on('room_created', async (roomId) => {
      const stream = await setLocalStream(mediaConstraints);
      videoRef.current.srcObject = stream;
      sessionStorage.setItem('isRoomCreator',true);
      console.log("room created with ID",id);
    });
    socket.current.on('start_call', async () => {
      console.log('Socket event callback: start_call')
      if (isRoomCreator()) {
        const rtcPeerConnection = new RTCPeerConnection(iceServers);
        const localStream=videoRef.current.srcObject;
    addLocalTracks(localStream,rtcPeerConnection);
        rtcPeerConnection.ontrack =(event)=>{
          setRemoteStream(event,remoteVideoRef)
        } 
        rtcPeerConnection.onicecandidate = (event)=>{sendIceCandidate(socket,id,event)}
        const sdp=await createOffer(rtcPeerConnection);
        console.log("Offerer sdp: ",sdp);
        socket.current.emit('webrtc_offer', {
          type: 'webrtc_offer',
          sdp: sdp,
          roomId:id
        })
        socket.current.on("webrtc_ice_candidate",(event)=>{
          console.log('Socket event callback: webrtc_ice_candidate');
          const candidate = new RTCIceCandidate({
            sdpMLineIndex: event.label,
            candidate: event.candidate,
          })
    rtcPeerConnection.addIceCandidate(candidate)
        })
        socket.current.on('webrtc_answer', (event) => {
          console.log('Socket event callback: webrtc_answer');
            rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(event));
        })
        console.log(rtcPeerConnection);
      }
    })
  };
  const Disconnect = () => {
    if (socket.current) {
      socket.current.disconnect();
      socket.current = null;
      videoRef.current.srcObject = null;
    sessionStorage.setItem('isRoomCreator',false);
      console.log("disconnected");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Video Call Room</h1>
      <div className='flex flex-row items-center'>
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
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
      >
        Start Call
      </button>
      <button
        onClick={Disconnect}
        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300 mt-2"
      >
        End Call
      </button>
    </div>
  );
}

export default CreatorRoom;
