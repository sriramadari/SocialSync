
export async function setLocalStream(mediaConstraints) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
    return stream;
  } catch (error) {
    console.error('Error getting local stream:', error);
    throw error;
  }
}

export async function addLocalTracks(localStream,rtcPeerConnection) {
  localStream.getTracks().forEach((track) => {
    rtcPeerConnection.addTrack(track, localStream)
  })
}

export function setRemoteStream(event, remoteVideoRef) {
  remoteVideoRef.current.srcObject = event.streams[0];
}

export  function sendIceCandidate(socket,id,event) {
  if (event.candidate) {
    socket.current.emit('webrtc_ice_candidate', {
      roomId:id,
      label: event.candidate.sdpMLineIndex,
      candidate: event.candidate.candidate,
    })
    console.log("ICEcandidates sent");
  }
}

export async function createOffer(rtcPeerConnection){
  try{
    const sessionDescription =await rtcPeerConnection.createOffer();
    rtcPeerConnection.setLocalDescription(sessionDescription);
    return sessionDescription;
  }catch(error){
    console.error(error);
    throw error;
  }
}

export async function createAnswer(rtcPeerConnection){
  try{
    const sessionDescription =await rtcPeerConnection.createAnswer();
    rtcPeerConnection.setLocalDescription(sessionDescription);
    return sessionDescription;
  }catch(error){
    console.error(error);
    throw error;
  }
}