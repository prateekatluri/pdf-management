import React from 'react';
import {
    createBrowserRouter,
    RouterProvider,
  } from "react-router-dom";
import HomePage from './Navbar';
import SignupPage from './Signup';
import LoginPage from './Login';
import DashboardPage from './Dashboard';
import UploadFile from './FileUpload';
const Router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
      children:[
        {
          path: "/",
          element: <LoginPage />,
        },
        {
          path: "/signup",
          element: <SignupPage />,
        
        },
        {
          path: "/login",
          element: <LoginPage />,
        },
        {
          path: "/dashboard",
          element: <DashboardPage />,
        },
        {
          path: "/upload",
          element: <UploadFile />,
        }
      ]
    },
    
  ]);
  

export default Router;
