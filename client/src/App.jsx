import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login'
import MainLogo from './components/MainLogo';
import SignUp from './components/SignUp';
import DoctorSignUp from './components/DoctorSignUp';
import DoctorLogin from './components/DoctorLogin';

const App = () => {
  return (
    // idhar using routes

    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/doctorsignup" element={<DoctorSignUp />} />
        <Route path="/doctorlogin" element={<DoctorLogin />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App