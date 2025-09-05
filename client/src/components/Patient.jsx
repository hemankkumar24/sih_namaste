import React from 'react'

const Patient = () => {
  return (
    <div className="w-full">
    <div className='flex w-full'>
        <div className='w-[70%] relative'>
        <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
        <input type="text" placeholder="Search" className="w-full py-3 px-10 rounded-lg bg-neutral-100 my-5
                    outline-none shadow-sm focus:shadow-md"
        />
        </div>
        <div className='w-[30%] relative py-5 px-5'>
            <div className='w-full flex justify-between items-center'>
                <div className='text-2xl font-semibold px-5'><i class="ri-booklet-fill pr-3"></i>Schedule</div>
                <div className='text-blue-600 hover:text-blue-700 cursor-pointer'>View all &rarr;</div>
            </div>
        </div>
    </div>
    </div>
  )
}

export default Patient