import React from 'react'

const PatientRow = ({ patientName, metricCode, date, time, status, index }) => {
  return (
    <div
      className={`flex justify-between text-xl px-10 py-3 ${
        index % 2 === 0 ? 'bg-neutral-200' : 'bg-neutral-100'
      }`}
    >
      <div className="w-1/5">{patientName}</div>
      <div className="w-1/5">{metricCode}</div>
      <div className="w-1/5">{date}</div>
      <div className="w-1/5">{time}</div>
      <div className="w-1/5">{status}</div>
    </div>
  )
}

export default PatientRow