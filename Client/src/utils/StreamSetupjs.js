export async function setLocalStream(mediaConstraints) {
    let stream
    try {
      stream = await navigator.mediaDevices.getUserMedia(mediaConstraints)
      return stream;
    } catch (error) {
      return error;
    }
}