import React, { useState } from 'react'
import DiagnosisForm from './DiagnosisForm';
import MedicineForm from './MedicineForm';

const Home = () => {
  const [showForm, setShowForm] = useState(false);
  const [diagnoses, setDiagnoses] = useState([]);

  const handleAddDiagnosis = (newDiagnosis) => {
    setDiagnoses([...diagnoses, newDiagnosis]);
    setShowForm(false);
  };

  const [showMedicineForm, setShowMedicineForm] = useState(false);
  const [medicines, setMedicines] = useState([]);

  const handleAddMedicine = (newMedicine) => {
    setMedicines([...medicines, newMedicine]);
    setShowMedicineForm(false);
  }

  return (
    <div>
      <input type="text" placeholder="Search" className="w-full py-3 px-10 rounded-lg bg-neutral-100 my-5 outline-none shadow-sm focus:shadow-md" />

      <div className='w-full mt-1 bg-neutral-100'>
        <div className='p-5'>
          <div className='text-2xl pb-5'>Start New Consultation</div>

          <div className='text-xl'>Patient Name</div>
          <input type="text" placeholder="Name" className="w-full py-3 px-10 rounded-lg bg-neutral-200 my-2 outline-none shadow-sm focus:shadow-md" />

          <div className='text-xl pt-2'>Age</div>
          <input type="text" placeholder="Age" className="w-full py-3 px-10 rounded-lg bg-neutral-200 my-2 outline-none shadow-sm focus:shadow-md" />

          <div className='text-xl pt-2'>Gender</div>
          <input type="text" placeholder="Gender" className="w-full py-3 px-10 rounded-lg bg-neutral-200 my-2 outline-none shadow-sm focus:shadow-md" />

          <div className='text-xl pt-2'>ABHA ID</div>
          <input type="text" placeholder="ABHA ID" className="w-full py-3 px-10 rounded-lg bg-neutral-200 my-2 outline-none shadow-sm focus:shadow-md" />

          <div className='text-xl pt-2'>Contact Number</div>
          <input type="number" placeholder="Phone Number" className="w-full py-3 px-10 rounded-lg bg-neutral-200 my-2 outline-none shadow-sm focus:shadow-md" />

          <div className='text-2xl py-5'>Report</div>

          <div className="px-5 py-1">
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700
              cursor-pointer"
            >
              New Diagnosis
            </button>

            {showForm && (
              <DiagnosisForm
                onSubmit={handleAddDiagnosis}
                onCancel={() => setShowForm(false)}
              />
            )}

            {/* Show diagnoses idhar */}
            {diagnoses.length > 0 && (
              <div className="mt-5">
                <h2 className="text-xl font-semibold mb-3">Diagnoses</h2>
                <ul className="space-y-2">
                  {diagnoses.map((diag, idx) => (
                    <li
                      key={idx}
                      className="p-3 bg-neutral-100 rounded shadow-sm flex justify-between"
                    >
                      <span>{diag.diagnosis}</span>
                      <span>{diag.severity}</span>
                      <span>Pain Score: {diag.painScore}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

        <div className='text-2xl py-5'>Prescription</div>
            
        <div className="px-5 py-1">
            <button
              onClick={() => setShowMedicineForm(!showMedicineForm)}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700
              cursor-pointer"
            >
              Add Medicine
            </button>

            {showMedicineForm && (
              <MedicineForm
                onSubmit={handleAddMedicine}
                onCancel={() => setShowMedicineForm(false)}
              />
            )}

            {/* Show medicines here */}
            {medicines.length > 0 && (
              <div className="mt-5">
                <h2 className="text-xl font-semibold mb-3">Medicines</h2>
                <ul className="space-y-2">
                  {medicines.map((med, idx) => (
                    <li
                      key={idx}
                      className="p-3 bg-neutral-100 rounded shadow-sm flex justify-between"
                    >
                      <span>{med.medicineName}</span>
                      <span>{med.dosage}</span>
                      <span>{med.duration}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </div>

        <button className=" my-5 px-5 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow hover:bg-blue-700 transition-colors cursor-pointer">
          Save and Send to EMR
        </button>


        </div>
      </div>
    </div>
  )
}

export default Home