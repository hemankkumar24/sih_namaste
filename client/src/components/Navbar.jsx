import React from 'react'

const Navbar = () => {
  return (
        <div className='text-3xl flex justify-end gap-10 border-b-1 border-neutral-300 pb-10'>
            <div><i className="ri-chat-1-fill text-neutral-700"></i></div>
            <div><i className="ri-notification-2-fill text-neutral-700"></i></div>
            <div><i className="ri-user-3-fill text-neutral-700"></i></div>
        </div>    
  )
}

export default Navbar