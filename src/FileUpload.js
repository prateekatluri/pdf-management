import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
const UploadFile = (props) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (selectedFile) {
      console.log('Uploading file:', selectedFile);
      const data = {filename:selectedFile}
      axios({
        method: 'post',
        url: 'https://pdf-project-392114.el.r.appspot.com/api/v1/file/upload',
        headers:{'x-access-token': localStorage.getItem("token"),"Content-Type":'multipart/form-data'},
        data:data
      })
      .then((response) => response.data)
      .then((data) =>{ 
        toast("Successfully uploaded file")
        setTimeout(() => {console.log("FETCHING AFTER 5SEC");props.comp.setUploadStatus(data)},4000)
        })
      .catch((error) => {
        const errorMsg = error.response.data.explaination
        if(errorMsg)
        {
            toast.error(errorMsg)
        }
        else
             toast.error("error uploading file")
    });
    } else {
      console.log('No file selected.');
    }
  };

  return (
    <div className="bg-gray-200 p-4 flex justify-center flex-col">
      <h2 className="text-2xl font-bold mb-4 text-center">Upload PDF File</h2>
      <div className="mb-4 flex justify-center">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="border border-gray-300 rounded px-3 py-2 w-1/5 "
        />
      </div>
      <button
        onClick={handleUpload}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-1/5 m-auto"
      >
        Upload
      </button>
    </div>
  );
};

export default UploadFile;
