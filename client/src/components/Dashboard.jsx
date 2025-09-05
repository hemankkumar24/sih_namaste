import React from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import Patient from './Patient'

const Dashboard = () => {
  return (
    <div>
        <Sidebar />
        <div className='pl-105 pt-10 pr-15'>
            <Navbar />

            <div className='w-full'><Patient /></div>


        </div>
    </div>
  )
}

export default Dashboard