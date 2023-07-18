import React, { useState, useEffect, useContext } from 'react';
import { MyContext } from './context';
import axios from 'axios';
import UploadFile from './FileUpload';
import { Document,Page,pdfjs} from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { toast } from 'react-toastify';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material'
import ShareIcon from '@mui/icons-material/Share';
// Import the styles
import '@react-pdf-viewer/core/lib/styles/index.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;


const DashboardPage = () => {
  const [pdfFiles, setPdfFiles] = useState([]);
  const { loggedIn, setLoggedIn, token, setToken,currentPdf,setCurrentPdf } = useContext(MyContext);
  const [uploadStatus, setUploadStatus] = useState(true);
  const [email, setEmail] = useState('');
  const [showEmailInput, setShowEmailInput] = useState();

  const handleMoreDetails = (pdfFile) => {
   
    setCurrentPdf(pdfFile);
    console.log(currentPdf);
    window.location.href= `/pdf-view/${pdfFile.id}`
  };

  useEffect(() => {
    fetchPdfFiles();
    
  }, [uploadStatus]);

  
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
  const handleShareSubmit = (id) => {
    setShowEmailInput(id);
    console.log(showEmailInput)
  }
  const handleShare = (id) => {
    console.log(id)
    if(!email) return
    axios({
        method: 'get',
        url: `https://pdf-project-392114.el.r.appspot.com/api/v1/file/share/${id}/${email}`,
        headers: { 'x-access-token': token },
      })
        .then((response) => response.data.data)
        .then((data) => {
         toast("Successfully shared file")
         setShowEmailInput()
         setEmail('')
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
                    {/* <Viewer fileUrl={pdfFile.sharedLink} initialPage={1} defaultScale={defaultScale} defaultScrollMode={defaultScrollMode}/> */}
                    </div>
                  ) : (
                    <div className="bg-gray-400  h-72 w-72 mt-3 p-4 rounded shadow flex justify-center items-center">
                      <p className="text-lg  font-bold">No Preview</p>
                    </div>
                  )}
                </div>
                <div className="flex flex-col">
                  <h3 className="text-lg font-bold text-center mb-2 break-all">{pdfFile.isShared && <ShareIcon />} {pdfFile.filename}</h3>
                  <div className="flex mb-2 flex-col space-y-3">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4  rounded "
                      onClick={() => handleDownload(pdfFile.uniqueName)}
                    >
                      Download
                    </button>
                     {showEmailInput == pdfFile.id && (
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
          {showEmailInput!= pdfFile.id && (
            <button onClick={()=>handleShareSubmit(pdfFile.id)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              Share
            </button>
          )}
          <Button variant="contained" color="primary" onClick={()=>{console.log(pdfFile); handleMoreDetails(pdfFile)}}>
            More Details
          </Button>
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
