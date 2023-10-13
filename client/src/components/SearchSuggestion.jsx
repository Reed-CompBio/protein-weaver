import React, { useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

export default function ProteinSuggestor({ proteinOptions, query, handleInputChange }) {
  const [selectedOption, setSelectedOption] = useState(null);
  
  // Define your suggestions array
  const suggestions = ["egfr", "flw"];

  return (
    <Autocomplete
      options={suggestions}
      getOptionLabel={(option) => option} // You don't need .label here because the suggestions are just strings
      value={selectedOption}
      onChange={(event, newValue) => {
        setSelectedOption(newValue);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          name="protein"
          label="Choose an option"
          placeholder="FBgn0031985"
          required
          value={query.protein}
          onChange={handleInputChange}
        />
      )}
    />
  );
}
