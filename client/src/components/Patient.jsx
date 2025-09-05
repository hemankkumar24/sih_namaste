import React from 'react'
import PatientRow from './PatientRow';

const Patient = () => {

    const sampleData = [
    { patientName: 'John Doe', metricCode: 'M001', date: '2025-09-05', time: '10:00 AM', status: 'Active' },
    { patientName: 'Jane Smith', metricCode: 'M002', date: '2025-09-05', time: '11:00 AM', status: 'Active' },
    { patientName: 'Bob Brown', metricCode: 'M003', date: '2025-09-05', time: '12:00 PM', status: 'Active' },
    { patientName: 'Alice Green', metricCode: 'M004', date: '2025-09-05', time: '01:00 PM', status: 'Active' },
    { patientName: 'Charlie White', metricCode: 'M005', date: '2025-09-05', time: '02:00 PM', status: 'Inactive' },
    { patientName: 'Diana Black', metricCode: 'M006', date: '2025-09-05', time: '03:00 PM', status: 'Active' },
    { patientName: 'Evan Blue', metricCode: 'M007', date: '2025-09-05', time: '04:00 PM', status: 'Active' },
    { patientName: 'Fiona Red', metricCode: 'M008', date: '2025-09-05', time: '05:00 PM', status: 'Active' },
    { patientName: 'George Yellow', metricCode: 'M009', date: '2025-09-05', time: '06:00 PM', status: 'Inactive' },
    { patientName: 'Hannah Purple', metricCode: 'M010', date: '2025-09-05', time: '07:00 PM', status: 'Active' },
  ];

  return (
    <div className="w-full">
    <div className='flex w-full'>
        <div className='w-[70%] relative'>
        <input type="text" placeholder="Search" className="w-full py-3 px-10 rounded-lg bg-neutral-100 my-5
                    outline-none shadow-sm focus:shadow-md"
        />
        <div className='w-full px-10 bg-neutral-100 py-3'>
            <div className='flex justify-between text-xl'>
                <div className='w-1/5'>Patient Name</div>
                <div className='w-1/5'>Metric Code</div>
                <div className='w-1/5'>Date</div>
                <div className='w-1/5'>Time</div>
                <div className='w-1/5'>Status</div>
            </div>
        </div>

        {sampleData.map((item, idx) => (
            <PatientRow
            key={idx}
            index={idx}
            patientName={item.patientName}
            metricCode={item.metricCode}
            date={item.date}
            time={item.time}
            status={item.status}
            />
        ))}

        </div>
        <div className='w-[30%] relative py-5 px-5'>
            <div className='w-full flex justify-between items-center'>
                <div className='text-2xl font-semibold px-5'><i class="ri-booklet-fill pr-3"></i>Schedule</div>
                <div className='text-blue-600 hover:text-blue-700 cursor-pointer'>View all &rarr;</div>
            </div>

            <div className='p-5'>
                <div className='border-2 border-blue-600 w-full h-50 rounded-md flex
                flex-col'>
                    <div className='mx-5 flex justify-between items-center border-b-1 '>
                        <div className='text-xl py-5'>John Doe</div>
                        <div className='my-5 p-1 px-3 bg-blue-600 rounded-md text-white'>Today</div>
                    </div>

                    <div className='p-5'>
                        <div className='text-lg font-semibold'>Metric Code: M001</div>
                    </div>

                    <div className='px-5'>
                        <div className='text-lg'>Due Date: <span className='font-semibold'>September 7, 2025</span></div>
                    </div>
                </div>
            </div>
            
            <div className='p-5'>
                <div className='border-2 border-blue-600 w-full h-50 rounded-md flex
                flex-col'>
                    <div className='mx-5 flex justify-between items-center border-b-1 '>
                        <div className='text-xl py-5'>Jane Smith</div>
                        <div className='my-5 p-1 px-3 bg-blue-600 rounded-md text-white'>Today</div>
                    </div>

                    <div className='p-5'>
                        <div className='text-lg font-semibold'>Metric Code: M002</div>
                    </div>

                    <div className='px-5'>
                        <div className='text-lg'>Due Date: <span className='font-semibold'>September 9, 2025</span></div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    </div>
  )
}

export default Patient