import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

const AutocompleteICDFull = ({ csvFile, onSelect }) => {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  // Load CSV
  useEffect(() => {
    Papa.parse(csvFile, {
      download: true,
      header: true,
      complete: (results) => setData(results.data),
    });
  }, [csvFile]);

  // Filter suggestions
  useEffect(() => {
    if (!query) return setSuggestions([]);
    const filtered = data.filter((row) =>
      row['ICD11_Title']?.toLowerCase().includes(query.toLowerCase())
    );
    setSuggestions(filtered.slice(0, 10));
  }, [query, data]);

  // Format row for input (as text)
  const formatRowForInput = (row) => {
    return `ICD11_Title: ${row['ICD11_Title']}, ICD11_Code: ${row['ICD11_Code']}, Ayurveda_NAMC_CODE: ${row['Ayurveda_NAMC_CODE']}, Siddha_NAMC_CODE: ${row['Siddha_NAMC_CODE']}, Unani_NUMC_CODE: ${row['Unani_NUMC_CODE']}`;
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search ICD11 Title..."
        className="w-full border rounded px-3 py-2"
      />

      {suggestions.length > 0 && (
        <ul className="absolute top-full left-0 w-full border bg-white shadow-lg z-10 max-h-72 overflow-y-auto">
          {suggestions.map((item, idx) => (
            <li
              key={idx}
              className="px-3 py-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => {
                setQuery(formatRowForInput(item));
                onSelect && onSelect(item);
                setSuggestions([]);
              }}
            >
              {/* Render each column with column name bold */}
              <div className="flex flex-wrap gap-2">
                <span><strong>ICD11_Title:</strong> {item['ICD11_Title']}</span>
                <span><strong>ICD11_Code:</strong> {item['ICD11_Code']}</span>
                <span><strong>Ayurveda_NAMC_CODE:</strong> {item['Ayurveda_NAMC_CODE']}</span>
                <span><strong>Siddha_NAMC_CODE:</strong> {item['Siddha_NAMC_CODE']}</span>
                <span><strong>Unani_NUMC_CODE:</strong> {item['Unani_NUMC_CODE']}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutocompleteICDFull;
