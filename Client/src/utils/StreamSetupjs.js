
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
