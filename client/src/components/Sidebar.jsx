import React from 'react'

const Sidebar = () => {
  return (
    <div className='h-screen w-100 fixed'>
        <div className='h-full w-100 bg-blue-500 flex flex-col'>
            <img src="public/svgs/whiteLogo.svg" className='w-20 m-7'/>
            <div className='text-white mt-5 text-xl border-t-1 border-b-1 border-white py-7 w-full px-10
                            font-semibold'>
                DASHBOARD
            </div>
            <div className='text-white text-xl px-20 py-7 h-[45%]'>
                <div>
                    <i className="ri-home-4-fill pr-3"></i> <span className='font-semibold'>Home</span>
                </div>
                <div className='py-7'>
                    <i className="ri-group-fill pr-3"></i> <span className='font-semibold'>Patients</span>
                </div>
                <div>
                    <i className="ri-robot-2-line pr-3"></i> <span className='font-semibold'>AI Chat</span>
                </div>
            </div>

            <div className='text-white mt-5 text-xl border-t-1 border-b-1 border-white py-7 w-full
                             px-20'>
                <div>   
                    <i className="ri-settings-4-fill pr-3"></i> <span className='font-semibold'>Account Settings</span>
                </div>
                <div className='pt-5'>
                    <i className="ri-notification-2-fill pr-3"></i> <span className='font-semibold'>Notifications</span>
                </div>
            </div>

             <div className='text-white text-xl px-20 py-15'>
                <div>
                    <i className="ri-logout-box-fill pr-3"></i> <span className='font-semibold'>Logout</span>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Sidebar