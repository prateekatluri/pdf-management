import React,{useState,useEffect} from 'react';
import { Link, Outlet } from 'react-router-dom';
import { MyContext } from "./context";
import { toast } from "react-toastify";
const Navbar = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [token, setToken] = useState('');
  const [currentPdf,setCurrentPdf] = useState()
  useEffect(()=>{
    setLoggedIn(localStorage.getItem("loggedin"));
    setToken(localStorage.getItem("token"));
  })
  const handleLogout = () => {
    localStorage.removeItem("loggedin")
    localStorage.removeItem("token");
    setToken('');
    setLoggedIn(false);
    window.location.href = "/login";
  };
  const handleDashboard = (e) => {
    e.preventDefault();
    if(!loggedIn) {
      toast("You must first login")
    }
    else{
      window.location.href = "/dashboard"
    }
    
  }
  return (
    <>
    <div>
      <nav className="bg-gray-800 p-4">
        <div className="  flex justify-normal items-center">
          <div className="text-white font-bold text-lg">PDF MANGEMENT APP</div>
          <div className="text-white font-bold text ml-auto">
           <Link
              to="/signup"
              className="text-white px-4 py-2 rounded-md mr-2 bg-blue-500 hover:bg-blue-700"
            >Sign Up
            </Link>
            {
              loggedIn?(<button
              onClick={handleLogout}
              className="text-white px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-700"
            >
              Logout
            </button>):<Link
              to="/login"
              className="text-white px-4 py-2 rounded-md mr-2 bg-blue-500 hover:bg-blue-700"
            >Login
            </Link>
            }
            <button
              onClick={(e)=>handleDashboard(e)}
              className="text-white px-4 py-2 rounded-md mr-2 ml-2 bg-blue-500 hover:bg-blue-700"
            >Dashboard
            </button>
          </div>
        </div>
      </nav>
    </div>
    <MyContext.Provider value={{ loggedIn, setLoggedIn, token, setToken,currentPdf,setCurrentPdf }}>
      <Outlet/>
    </MyContext.Provider>
    </>
  );
};

export default Navbar;
