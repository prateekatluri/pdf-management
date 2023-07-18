import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom/dist';
import { Document,Page,pdfjs} from 'react-pdf';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { Box, Button, TextField } from '@mui/material';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;



const PdfView = () => { 
  const {fileId} = useParams();
  const [pdfFile,setPdfFile] = useState()
  console.log(fileId);
  const [allcomments,setAllComments] = useState([]);
  const [newcomments,setnewComments] = useState([]);
  const [comment,setComment]= useState();
  const handleAddComment =  (e) => {
    e.preventDefault();
    axios({
              method: 'post',
              url: `https://pdf-project-392114.el.r.appspot.com/api/v1/comment/add/${fileId}/${comment}`,
              headers: { 'x-access-token': localStorage.getItem('token') },
            })
              .then((response) => response)
              .then((data) => {
                console.log(data)
                toast('Comments saved');
                setnewComments(comment)
                setComment("")
              })
              .catch((error) => {
              toast.error('Comments not saved');
                console.log(error);
        });
  }
  useEffect(()=>{
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
            return
            })
            .catch((error) => {
            toast.error('error displaying comment');
            console.log(error);
    });
  },[newcomments])
  useEffect(()=>{
    axios({
        method: 'get',
        url: `https://pdf-project-392114.el.r.appspot.com/api/v1/file/${fileId}`,
        headers: { 'x-access-token': localStorage.getItem('token') },
      })
        .then((response) => response.data.data)
        .then((data) => {
          console.log(data)
          setPdfFile(data);
        })
        .catch((error) => {
          setPdfFile([]);
          console.log(error);
        });
  },[])
  return (
    <div>
        <h2 className="text-lg font-semibold text-center">PDF-VIEW</h2>
        <div className="grid grid-cols-2">
            <div className='mt-2 mr-2'>
            {pdfFile &&
                <iframe src={`${pdfFile[0].sharedLink}#toolbar=0`} title="testPdf" className='h-full w-1/2 absolute' />
            }
            </div>
            <div className="flex flex-col items-end h-full border-2 border-gray-300 rounded-md p-4 m-4">
      {allcomments && allcomments.map((comment,id) => (
        <div key={id} className="bg-gray-100 p-2 mb-2 rounded">
          {comment.content}
        </div>
      ))}
      <input
        type="text"
        placeholder="Add Comment"
        className="w-full mb-2 p-2 border border-gray-300 rounded"
        value={comment}
        onChange={(e)=> setComment(e.target.value)}
      />
      <button
        className="self-center px-4 py-2 bg-blue-500 text-white rounded"
        onClick={(e) => handleAddComment(e)}   
      >
        Add
      </button>
    </div>
        </div>
    </div>
  )
}

export default PdfView