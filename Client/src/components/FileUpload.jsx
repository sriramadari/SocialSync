import React, { useState } from 'react';

const FileUpload = ({ onFileUpload }) => {
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    console.log(file); 
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {

        console.log(event.target.result)
         setQuillContent(content);
        setQuillContent(content);// Send the file content to the parent component
      };
      reader.readAsText(file);
    }
  };

  return (
    <input type="file" accept=".txt" onChange={handleFileUpload} />
  );
};

export default FileUpload;
