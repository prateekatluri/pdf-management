import React, { useState, useEffect, useContext } from 'react';
import { MyContext } from './context';
import axios from 'axios';
import UploadFile from './FileUpload';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { toast } from 'react-toastify';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material'


pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

const DashboardPage = () => {
  const [pdfFiles, setPdfFiles] = useState([]);
  const { loggedIn, setLoggedIn, token, setToken } = useContext(MyContext);
  const [uploadStatus, setUploadStatus] = useState(true);
  const [numPages, setNumPages] = useState(null);
  const [email, setEmail] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [showCommentsDialog, setShowCommentsDialog] = useState(false);
  const [comments, setComments] = useState('');
  const [allComments, setAllComments] = useState([]);
  const [file_id,setfileid] = useState()
  const handleOpenComments = (id) => {
    // Open the comments dialog
    console.log(id)
    setfileid(id)
    handleViewComments(id);
    setShowCommentsDialog(true);
  };

  const handleCloseComments = () => {
    // Close the comments dialog
    setShowCommentsDialog(false);
    setfileid(undefined);
    setComments('')
    setAllComments([])
  };

  const handleSaveComments = (comments) => {

    console.log(file_id)
    axios({
        method: 'post',
        url: `https://pdf-project-392114.el.r.appspot.com/api/v1/comment/add/${file_id}/${comments}`,
        headers: { 'x-access-token': localStorage.getItem('token') },
      })
        .then((response) => response)
        .then((data) => {
          console.log(data)
          toast('Comments saved');
        })
        .catch((error) => {
        toast.error('Comments not saved');
          console.log(error);
        });
  }

  const handleViewComments = (fileId) => {
    axios({
        method: 'get',
        url: `https://pdf-project-392114.el.r.appspot.com/api/v1/comment/${fileId}`,
        headers: { 'x-access-token': localStorage.getItem('token') },
      })
        .then((response) => response.data.data)
        .then((data) => {
          console.log(data)
          setAllComments(data)
          toast('successfully displaying comment');
        })
        .catch((error) => {
        toast.error('error displaying comment');
          console.log(error);
        });
  }
  useEffect(() => {
    fetchPdfFiles();
  }, [loggedIn, uploadStatus]);

  
  const fetchPdfFiles = () => {
    axios({
      method: 'get',
      url: 'https://pdf-project-392114.el.r.appspot.com/api/v1/file/',
      headers: { 'x-access-token': localStorage.getItem('token') },
    })
      .then((response) => response.data.data)
      .then((data) => {
        console.log(data)
        setPdfFiles(data);
      })
      .catch((error) => {
        setPdfFiles([]);
        console.log(error);
      });
  };

  const handleDownload = (filename) => {
    console.log(`Downloading PDF file: ${filename}`);
    axios({
      method: 'get',
      url: `https://pdf-project-392114.el.r.appspot.com/api/v1/file/download/${filename}`,
      headers: { 'x-access-token': token },
    })
      .then((response) => response.data.data)
      .then((data) => {
        window.location.href = data;
      })
      .catch((error) => console.log(error));
  };
  const handleShareSubmit = () => {
    console.log("ffgdfgdf")
    setShowEmailInput(true);
    console.log(showEmailInput)
  }
  const handleShare = (id) => {
    console.log(id)
    axios({
        method: 'get',
        url: `https://pdf-project-392114.el.r.appspot.com/api/v1/file/share/${id}/${email}`,
        headers: { 'x-access-token': token },
      })
        .then((response) => response.data.data)
        .then((data) => {
         toast("Successfully shared file")
         setShowEmailInput(false)

        })
        .catch((error) => {

            toast.error("Error "+error.response.data.error.explaination)
        })
  }

  return (
    <>
      <div className="mx-auto">
        <h2 className="text-2xl font-bold bg-gray-200 text-center pt-1">Dashboard</h2>
        <UploadFile comp={{ uploadStatus, setUploadStatus }} />
        <div className="grid grid-cols-5 gap-4">
          {pdfFiles.length === 0 ? (
            <div className="bg-gray-500 p-4  flex justify-center m-auto rounded shadow col-span-5 mt-2">
              <p className="text-lg text-center font-bold">YOU HAVE NOT UPLOADED ANY FILES</p>
            </div>
          ) : (
            pdfFiles.map((pdfFile) => (
              <div
                key={pdfFile.id}
                className="bg-gray-200 w-5/5 m-1 h-[500px] rounded shadow flex flex-col "
              >
                <div className="flex justify-center">
                {pdfFile.sharedLink ? (
                    <div className=" h-72 w-72 mt-3 p-4 rounded shadow flex justify-center items-center">
                    <Document file={pdfFile.sharedLink}>
                        <Page width={200} pageNumber={1} />
                    </Document>
                    </div>
                  ) : (
                    <div className="bg-gray-400  h-72 w-72 mt-3 p-4 rounded shadow flex justify-center items-center">
                      <p className="text-lg  font-bold">No Preview</p>
                    </div>
                  )}
                </div>
                <div className="flex flex-col">
                  <h3 className="text-lg font-bold text-center mb-2 break-all">{pdfFile.filename}</h3>
                  <div className="flex mb-2 flex-col space-y-3">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4  rounded "
                      onClick={() => handleDownload(pdfFile.uniqueName)}
                    >
                      Download
                    </button>
                     {showEmailInput && (
            <div className="flex flex-col space-y-3">
              <input
                type="email"
                placeholder="Enter email to share"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button onClick={()=>handleShare(pdfFile.id)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                Share
              </button>
            </div>
          )}
          {!showEmailInput && (
            <button onClick={()=>handleShareSubmit()} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              Share
            </button>
          )}
          {/* Button to open comments dialog */}
          <Button variant="contained" color="primary" onClick={()=>{console.log(pdfFile.id); handleOpenComments(pdfFile.id)}}>
            Add Comments
          </Button>

          {/* Comments dialog */}
          <Dialog open={showCommentsDialog} onClose={handleCloseComments}>
            <DialogTitle>Add Comments</DialogTitle>
            <DialogContent>
              {/* Render the comments inside the dialog */}
              {allComments.map((comment, index) => (
                <div key={index}>
                  <p>{comment.content}</p>
                  <hr />
                </div>
              ))}

              {/* Comment input */}
              <TextField
                multiline
                rows={4}
                variant="outlined"
                placeholder="Enter your comments..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseComments} color="primary">
                Cancel
              </Button>
              <Button onClick={()=>handleSaveComments(comments)} color="primary">
                Save
              </Button>
            </DialogActions>
          </Dialog>

                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
