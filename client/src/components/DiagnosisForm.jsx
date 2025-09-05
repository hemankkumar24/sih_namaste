import React, { useState } from 'react';
import AutocompleteICDFull from './AutocompleteICDFull';

const DiagnosisForm = ({ onSubmit, onCancel }) => {
  const [diagnosis, setDiagnosis] = useState('');
  const [severity, setSeverity] = useState('');
  const [painScore, setPainScore] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ diagnosis, severity, painScore });
    setDiagnosis('');
    setSeverity('');
    setPainScore('');
  };

  return (

    
    <form
      onSubmit={handleSubmit}
      className="p-5 bg-neutral-100 rounded-lg shadow-md space-y-4 mt-3"
    >
      <div>
        <label className="block font-semibold mb-1">Diagnosis</label>
        <AutocompleteICDFull
          csvFile="/csv/query_database.csv" 
          onSelect={(row) => setDiagnosis(
      // Fill with all columns as "ColumnName: Value"
          `ICD11_Title: ${row['ICD11_Title']}, Ayurveda_NAMC_CODE: ${row['Ayurveda_NAMC_CODE']}, Siddha_NAMC_CODE: ${row['Siddha_NAMC_CODE']}, Unani_NUMC_CODE: ${row['Unani_NUMC_CODE']}, ICD11_Code: ${row['ICD11_Code']}`
        )}
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Severity Level</label>
        <select
          value={severity}
          onChange={(e) => setSeverity(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        >
          <option value="">Select severity</option>
          <option value="Mild">Mild</option>
          <option value="Moderate">Moderate</option>
          <option value="Severe">Severe</option>
        </select>
      </div>

      <div>
        <label className="block font-semibold mb-1">Pain Score</label>
        <input
          type="number"
          value={painScore}
          onChange={(e) => setPainScore(e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="0-10"
          min="0"
          max="10"
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

export default DiagnosisForm;