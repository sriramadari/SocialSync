import React, { useState,useEffect,useRef} from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { EditerSocket } from '../services/socketconnection';


const Editor = () => {
  const [fileContent, setFileContent] = useState(''); // Store text file content
  const [quillContent, setQuillContent] = useState(''); // Store Quill editor content
  const socket = useRef(null);


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
    socket.current.emit('editor-change', content); // Emit the change to other clients
  };

  useEffect(() => {
    // Listen for changes from other users and update the Quill editor
    socket.current = EditerSocket().connect();
    socket.current.on('editor-change', (content) => {
      setQuillContent(content);
    });

    return () => {
      socket.current.disconnect(); // Clean up the socket connection when the component unmounts
    };
  }, [socket]);
  return (
    <div>
      {/* <FileUpload onFileUpload={handleFileUpload} /> */}
      <input type="file" accept=".txt" onChange={handleFileUpload} />
      <ReactQuill
        value={quillContent}
        onChange={handleContentChange}
        theme="snow"
      />
    </div>
  );
};

export default Editor;
