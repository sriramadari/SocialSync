# Social-Sync Application

The **Social Sync Application** is a real-time communication platform that allows users to join rooms created by other users, enabling seamless audio and video synchronization using WebRTC and Socket.io.

## Features

- **Create and Join Rooms**: Users can create rooms and share the room ID with others to join.
- **Real-Time Audio and Video Sync**: Users in the same room can engage in real-time audio and video communication.
- **Simple and User-Friendly Interface**: An intuitive interface that makes it easy for users to create and join rooms.

## Technologies Used

- [Socket.io](https://socket.io/): A library for real-time, bidirectional communication between web clients and servers.
- [WebRTC](https://webrtc.org/): A free, open-source project that provides web browsers and mobile applications with real-time communication capabilities.

## Installation

1. **Clone this repository** to your local machine:

   ```bash
   git clone https://github.com/sriramadari/SocialSync.git
   cd SocialSync

2. **Install the project dependencies**:

   ```bash
   cd Client && npm install
   npm run dev
   cd ..
   cd server
   npm install
   node socket.js

## Open your web browser and navigate to http://localhost:3000 to use the application.

# Usage
**Create a Room:**

1. Click on the "Create Room" button.
2. Share the generated Room ID with others.
3. start call 

**Join a Room:**

1. Enter the Room ID shared by the host.
2. Click the "Join Room" button.

**Start Video and Audio:**

- Once inside a room,click "start call" to grant necessary permissions for video and audio access when prompted by your browser.
- Enjoy real-time video and audio synchronization with other room participants.

**End a Session:**

- Click the "End call" button to disconect from current room.

# Contributing
Contributions are welcome! If you have suggestions or encounter issues, please open an issue or submit a pull request.

# Acknowledgments
- Socket.io and WebRTC communities for their fantastic libraries and documentation.
- Any other acknowledgments or resources you'd like to credit.

# Contact
For any inquiries or support, please contact [sriramadari.dev@gmail.com].

