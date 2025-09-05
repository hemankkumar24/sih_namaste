import React, { useState } from 'react'
import DiagnosisForm from './DiagnosisForm';
import MedicineForm from './MedicineForm';

const Home = () => {
  const [showForm, setShowForm] = useState(false);
  const [diagnoses, setDiagnoses] = useState([]);

  // fhir bundle 1
  const [patient, setPatient] = useState({
    resourceType: "Patient",
    id: crypto.randomUUID(),
    name: [{ text: "" }],
    gender: "",
    birthDate: "", 
    identifier: [{ system: "ABHA", value: "" }],
    telecom: [{ system: "phone", value: "" }]
  });

  const handleChange = (field, value) => {
    setPatient((prev) => {
        const updated = { ...prev };

        if (field === "name") updated.name[0].text = value;
        else if (field === "gender") updated.gender = value;
        else if (field === "birthDate") updated.birthDate = value;
        else if (field === "abha") updated.identifier[0].value = value;
        else if (field === "phone") updated.telecom[0].value = value;

        return updated;
    });
  };  


  const handleAddDiagnosis = (diag) => {
  const parts = diag.diagnosis.split(",").reduce((acc, part) => {
    const [key, value] = part.split(":").map((s) => s.trim());
    acc[key] = value;
    return acc;
  }, {});

  const fhirCondition = {
      resourceType: "Condition",
      id: `cond-${diagnoses.length + 1}`,
      code: {
        coding: [
          {
            system: "NAMASTE",
            code: parts["Ayurveda_NAMC_CODE"] || "",
            display: parts["ICD11_Title"] || diag.diagnosis,
          },
          {
            system: "ICD-11",
            code: parts["ICD11_Code"] || "",
            display: parts["ICD11_Title"] || diag.diagnosis,
          },
        ],
        text: parts["ICD11_Title"] || diag.diagnosis,
      },
      severity: {
        text: diag.severity,
      },
      note: [
        {
          text: `Pain Score: ${diag.painScore}`,
        },
      ],
      subject: {
        reference: "Patient/patient-001",
      },
    };

    setDiagnoses([...diagnoses, fhirCondition]); // store FHIR objects
  };

  const [showMedicineForm, setShowMedicineForm] = useState(false);
  const [medicines, setMedicines] = useState([]);

  const handleAddMedicine = (med) => {
    const fhirMedicationRequest = {
      resourceType: "MedicationRequest",
      id: `med-${medicines.length + 1}`,
      status: "active",
      intent: "order",
      medicationCodeableConcept: {
        text: med.medicineName,
      },
      subject: {
        reference: "Patient/patient-001",
      },
      dosageInstruction: [
        {
          text: `${med.dosage} for ${med.duration}`,
        },
      ],
    };

    setMedicines([...medicines, fhirMedicationRequest]); // store as FHIR
    setShowMedicineForm(false);
  };

  // fhir bundle 2 and 3
    const fhirBundle = {
    resourceType: "Bundle",
    type: "collection",
    entry: [
      { resource: patient },
      ...diagnoses.map((cond) => ({ resource: cond })),
      ...medicines.map((med) => ({ resource: med })),
    ],
  };

  const logFhirBundle = () => {
    const fhirBundle = {
    resourceType: "Bundle",
    type: "collection",
    entry: [
      { resource: patient },
      ...diagnoses.map((cond) => ({ resource: cond })),
      ...medicines.map((med) => ({ resource: med })),
      ],
    };

    console.log(fhirBundle);
    console.log(patient);
  }

  return (
    <div>
      <input type="text" placeholder="Search" className="w-full py-3 px-10 rounded-lg bg-neutral-100 my-5 outline-none shadow-sm focus:shadow-md" />

      <div className='w-full mt-1 bg-neutral-100'>
        <div className='p-5'>
          <div className='text-2xl pb-5'>Start New Consultation</div>

          <div className='text-xl'>Patient Name</div>
          <input type="text" placeholder="Name" className="w-full py-3 px-10 rounded-lg bg-neutral-200 my-2 outline-none shadow-sm focus:shadow-md" onChange={(e) => handleChange("name", e.target.value)}/>

          <div className='text-xl pt-2'>Age</div>
          <input type="text" placeholder="Age" className="w-full py-3 px-10 rounded-lg bg-neutral-200 my-2 outline-none shadow-sm focus:shadow-md" onChange={(e) => handleChange("birthDate", e.target.value)}/>

          <div className='text-xl pt-2'>Gender</div>
          <input type="text" placeholder="Gender" className="w-full py-3 px-10 rounded-lg bg-neutral-200 my-2 outline-none shadow-sm focus:shadow-md" onChange={(e) => handleChange("gender", e.target.value)}/>

          <div className='text-xl pt-2'>ABHA ID</div>
          <input type="text" placeholder="ABHA ID" className="w-full py-3 px-10 rounded-lg bg-neutral-200 my-2 outline-none shadow-sm focus:shadow-md" onChange={(e) => handleChange("abha", e.target.value)}/>

          <div className='text-xl pt-2'>Contact Number</div>
          <input type="number" placeholder="Phone Number" className="w-full py-3 px-10 rounded-lg bg-neutral-200 my-2 outline-none shadow-sm focus:shadow-md" onChange={(e) => handleChange("phone", e.target.value)}/>

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
                  {diagnoses.map((cond, idx) => (
                    <li
                      key={idx}
                      className="p-3 bg-neutral-100 rounded shadow-sm flex flex-col"
                    >
                      <span className="font-semibold">{cond.code.text}</span>
                      <span>Severity: {cond.severity?.text}</span>
                      <span>{cond.note?.[0]?.text}</span>
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
                      className="p-3 bg-neutral-100 rounded shadow-sm flex flex-col"
                    >
                      <span className="font-semibold">{med.medicationCodeableConcept.text}</span>
                      <span>Status: {med.status}</span>
                      <span>{med.dosageInstruction?.[0]?.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </div>

        <button className=" my-5 px-5 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow hover:bg-blue-700 transition-colors cursor-pointer" onClick={logFhirBundle}>
          Save and Send to EMR
        </button>


        </div>
      </div>
    </div>
  )
}

export default Home