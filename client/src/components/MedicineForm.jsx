import React, { useState } from 'react';

const MedicineForm = ({ onSubmit, onCancel }) => {
  const [medicineName, setMedicineName] = useState('');
  const [dosage, setDosage] = useState('');
  const [duration, setDuration] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ medicineName, dosage, duration });
    setMedicineName('');
    setDosage('');
    setDuration('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-5 bg-neutral-100 rounded-lg shadow-md space-y-4 mt-3"
    >
      <div>
        <label className="block font-semibold mb-1">Medicine Name</label>
        <input
          type="text"
          value={medicineName}
          onChange={(e) => setMedicineName(e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="Enter medicine name"
          required
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Dosage</label>
        <input
          type="text"
          value={dosage}
          onChange={(e) => setDosage(e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="e.g., 500mg"
          required
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Duration</label>
        <input
          type="text"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="e.g., 5 days"
          required
        />
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Add
        </button>
      </div>
    </form>
  );
};

export default MedicineForm;
