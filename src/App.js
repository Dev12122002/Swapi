import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import { Toaster } from 'react-hot-toast';
import React, { useState, useEffect } from 'react'
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { verifyJWT } from './Helper/LoginHelper';
import Cookies from 'js-cookie';

function App() {

  const [isLoggedIn, setLoggedIn] = useState(false);

  const checkLogin = async () => {
    let refreshToken = Cookies.get('refresh_token');
    const token = localStorage.getItem('token');
    if (refreshToken === undefined) {
      setLoggedIn(false);
      return;
    } else {
      const payload = await verifyJWT(refreshToken);
      if (payload.data === '') {
        setLoggedIn(false);
        return;
      }
      if (token) {
        const payload = await verifyJWT(token);
        if (payload.data !== '') {
          setLoggedIn(true);
        }
      }
    }
  };

  useEffect(() => {
    checkLogin();
  }, []);


  return (
    <BrowserRouter>

      <Toaster position='top-center' />
      <Routes>
        <Route exact path="/Login" element={isLoggedIn ? <Navigate to="/" /> : <Login isLoggedIn={isLoggedIn} setLoggedIn={setLoggedIn} />} />
        <Route path="/" element={isLoggedIn ? <Home setLoggedIn={setLoggedIn} /> : <Navigate to="/Login" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
