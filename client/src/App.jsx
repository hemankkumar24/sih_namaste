import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login'
import MainLogo from './components/MainLogo';
import SignUp from './components/SignUp';

const App = () => {
  return (
    // idhar using routes

    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App