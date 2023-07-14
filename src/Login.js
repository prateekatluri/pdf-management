import React, { useState,useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { MyContext } from './context';
import {  toast } from "react-toastify";

const LoginPage = () => {
  const { loggedIn, setLoggedIn, token, setToken } = useContext(MyContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {email:email,password:password}
    const response =  axios.post('https://pdf-project-392114.el.r.appspot.com/api/v1/user/signin',data).then((response) => {
        localStorage.setItem("loggedin",true)
        localStorage.setItem("token",response.data.data)
        setLoggedIn(localStorage.getItem("loggedin"));
        setToken(localStorage.getItem("token"));
        toast("You have successfully logged in!");
        window.location.href = "/dashboard";
        })
        .catch((error) => {
            const errormsg = error.response.data.error.explaination
            console.log(errormsg);
            toast.error("Error: " + errormsg, {
                toastId: 'failure',
            })
        });
    // setEmail('');
    // setPassword('');
  };

  return (
    <div className="max-w-xs mx-auto">
      <h2 className="text-2xl font-bold mb-4">Login Page</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2">
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            required
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block mb-2">
            Password:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            required
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Log In
        </button>
        
      </form>
      <p className="mt-4">
        Don't have an account?{' '}
        <Link to="/signup" className="text-blue-500 hover:underline">
          Sign up
        </Link>
      </p>
    </div>

  );
};

export default LoginPage;