import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {name:name,email:email,password:password}
    const response =  axios.post('https://pdf-project-392114.el.r.appspot.com/api/v1/user/signup',data).then((response) => {
        toast("You have successfully logged in!");
        window.location.href = "/login";
        })
        .catch((error) => {
            const errorMessage = error.response.data.error.explaination;
            console.log(errorMessage);
            toast.error("Error: " + errorMessage, {
                toastId: 'failure',
            })
        });
  };

  return (
    <div className=" mx-auto ">
      <h2 className="text-2xl font-bold  bg-gray-200 text-center pt-1 ">Signup Page</h2>
      <form action="localhost:3000/user/signup" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2" htmlFor="name">Name:</label>
          <input
            className="border border-gray-300 rounded px-3 py-2 w-full"
            type="text"
            id="name"
            value={name}
            onChange={handleNameChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2" htmlFor="email">Email:</label>
          <input
            className="border border-gray-300 rounded px-3 py-2 w-full"
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2" htmlFor="password">Password:</label>
          <input
            className="border border-gray-300 rounded px-3 py-2 w-full"
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          type="submit"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignupPage;