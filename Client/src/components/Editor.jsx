import React, { useEffect, useState, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import QuillCursors from 'quill-cursors'; // Import the quill-cursors library
import { EditerSocket } from '../services/socketconnection';
import Quill from 'quill';
Quill.register('modules/cursors', QuillCursors); // Register the module

const Editor = () => {
  const [fileContent, setFileContent] = useState(''); // Store text file content
  const [quillContent, setQuillContent] = useState(''); // Store Quill editor content
  const socket = useRef(null);
  const quillRef = useRef(null); // Reference to the Quill editor instance
  
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    console.log(file); 
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        
        console.log(event.target.result)
        setFileContent(event.target.result);
        setQuillContent(event.target.result);
        socket.current.emit('editor-change', event.target.result);

      };
      reader.readAsText(file);
    }
  };

  const handleContentChange = (content) => {
    setQuillContent(content);
    socket.current.emit('editor-change', content);
  };

  useEffect(() => {
    socket.current = EditerSocket().connect();
    socket.current.on('editor-change', (content) => {
      setQuillContent(content);
      quillRef.current.setContents(content);
    });

    return () => {
      socket.current.disconnect();
    };
  }, [socket]);

//   useEffect(() => {
//     if (quillRef.current) {
//         quillRef.current.setContents(content); // Enable cursor synchronization
//     }
//   }, [quillRef]);
// useEffect(() => {
//     socket.current = EditerSocket().connect();

//     // Listen for changes from other users and update the Quill editor
//     socket.current.on('editor-change', (content) => {
//       if (quillRef.current) {
//         // Check if quillRef.current is defined before using getModule
//         quillRef.current.setContents(content); // Use setContents to update the Quill editor
//       }
//     });

//     return () => {
//       socket.current.disconnect();
//     };
//   }, [socket]);

  return (
    <div>
      <input type="file" accept=".txt" onChange={handleFileUpload} />
      <ReactQuill
        ref={quillRef}
        value={quillContent}
        onChange={handleContentChange}
        theme="snow"
        modules={{
          cursors: true, // Enable cursors module
        }}
      />
    </div>
  );
};

export default Editor;


