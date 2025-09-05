import React, { useState } from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import Patient from './Patient'
import Home from './Home'
import AIChat from './AIChat'

const Dashboard = () => {

  const [activeComponent, setActiveComponent] = useState('home');

  return (
    <div>
        <Sidebar setActiveComponent={setActiveComponent} />
        <div className='pl-105 pt-10 pr-15'>
            <Navbar />
            <div className='w-full'>
              {activeComponent === 'patient' && <Patient />}
              {activeComponent === 'home' && <Home />}
              {activeComponent === 'aichat' && <AIChat />}
            </div>
        </div>
    </div>
  )
}

export default Dashboard