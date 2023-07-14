import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Router from './Router';
import {
  RouterProvider,
} from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <RouterProvider router={Router} />
    <ToastContainer/>
  </>
  
);

