import React, { useState, useEffect } from "react";
import Modetooltip from "./ModeTooltip";
import AsyncSelect from "react-select/async";

export default function SearchBar({
  handleSubmit,
  submitRef,
  query,
  handleInputChange,
  handleKInputChange,
  getExample,
  handleGuide,
  handleSpeciesChange,
  handleQueryMode,
  activeModeButton,
}) {
  const [selectedProteinOption, setSelectedProteinOption] = useState(null);
  const [proteinOptions, setProteinOptions] = useState([]);
  const [selectedGoTermOption, setSelectedGoTermOption] = useState(null);
  const [goTermOptions, setGoTermOptions] = useState([]);
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: '40px', // Decrease the height of the input
      height: '40px',
      backgroundColor: 'black',
      borderColor: state.isFocused ? 'black' : 'black',
      boxShadow: state.isFocused ? '0 0 0 1px black' : 'none',
      '&:hover': {
        borderColor: 'black'
      }
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#edcb96' : state.isFocused ? '#efe6dd' : '#fff',
      color: state.isSelected ? '#fff' : '#333',
      '&:hover': {
        backgroundColor: '#efe6dd'
      }
    }),
    input: (provided, state) => ({
      ...provided,
      color: 'grey'
    }),
    valueContainer: (provided, state) => ({
      ...provided,
      height: '40px',
      padding: '0 6px'
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: 'white'
    }),
    placeholder: (provided, state) => ({
      ...provided,
      color: '#999'
    }),
    menu: (provided, state) => ({
      ...provided,
      backgroundColor: '#fff',
      zIndex: 100
    }),
    menuList: (provided, state) => ({
      ...provided,
      padding: 0,
      borderRadius: '3px'
    }),
  };

  // Fetch protein autocomplete data
  useEffect(() => {
    console.log("Fetching protein autocomplete data...")
    // Fetch all data options from your API once when the component mounts
    const fetchData = async () => {
      try {
        const response = await fetch("/api/getProteinOptions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(query),
        });
        const data = await response.json();
        let formattedOptions = [];
        data.map((item) =>
          formattedOptions.push({
            type: "protein",
            value: item.id,
            label: item.name,
          })
        );
        data.map((item) =>
          formattedOptions.push({
            type: "protein",
            value: item.id,
            label: item.id,
          })
        );
        setProteinOptions(formattedOptions);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, [query.species]);

  // Set the selected protein option
  useEffect(() => {
    console.log("useEffect triggered", query.protein)
    console.log(proteinOptions.length)
    proteinOptions.map((item) => {
      if (item.value == query.protein && item.value != item.label) {
        console.log("setting label")
        setSelectedProteinOption({
          value: item.value,
          label: item.label,
          type: "protein",
        });
      }
    });
  }, [query.protein]);

  // Filters the options based on the input value
  const loadProteinOptions = (inputValue, callback) => {
    if (!inputValue) {
      // If there is no input, return an empty array
      callback([]);
      return;
    }

    // Filter options based on the input value
    const filteredOptions = proteinOptions.filter((option) =>
      option.label.toLowerCase().includes(inputValue.toLowerCase())
    );
    // Limit the number of options to display
    const limitedOptions = filteredOptions.slice(0, 10); // Limit to 10 options
    callback(limitedOptions);
  };

  // Calls the functions when the user selects an option
  const handleProteinChange = (option) => {
    setSelectedProteinOption(option);
    handleInputChange(option);
  };

  // Fetch autocomplete options for GO Terms
  useEffect(() => {
    console.log("Fetching GO term autocomplete data...");
    fetch("/api/getGoTermOptions")
      .then((res) => res.json())
      .then((data) => {
        const formattedOptions = data.map((item) => ({
          label: item.name || item.id,
          value: item.id,
          type: "goTerm",
        }));
        setGoTermOptions(formattedOptions);
      })
      .catch((error) => {
        console.error("Error fetching GO term options:", error);
      });
  }, []);

  // Set the selected GO term option based on query
  useEffect(() => {
    console.log("useEffect triggered", query.goTerm);
    console.log(goTermOptions.length);
    goTermOptions.map((item) => {
      if (item.value == query.goTerm && item.value != item.label) {
        console.log("setting label");
        setSelectedGoTermOption({
          value: item.value,
          label: item.label,
          type: "goTerm",
        });
      }
    });
  }, [query.goTerm]);

  // Filters the options based on the input value
  const loadGoTermOptions = (inputValue, callback) => {
    if (!inputValue) {
      callback([]);
      return;
    }

    // Filter options based on the input value
    const filteredOptions = goTermOptions.filter((option) =>
      option.label.toLowerCase().includes(inputValue.toLowerCase())
    );

    // Limit the number of options to display
    const limitedOptions = filteredOptions.slice(0, 10); // Limit to 10 options
    callback(limitedOptions);
  };

  // Calls the functions when the user selects an option
  const handleGoTermChange = (option) => {
    setSelectedGoTermOption(option);
    handleInputChange(option);
  };

  // Set species name
  let spName = ""
  if (query.species == "txid224308") {
    spName = "B. subtilis"
  }
  else if (query.species == "txid7227") {
    spName = "D. melanogaster"
  }
  else if (query.species == "txid7955") {
    spName = "D. rerio"
  }

  return (
    // Search Bar Component
    <div className="query-container">
      {/* search inputs and button */}
      <form method="post" onSubmit={handleSubmit}>
        <div className="search-container">
          <div className="search-input-wrapper">
            <AsyncSelect
              styles={customStyles}
              className="protein-input-container"
              cacheOptions
              loadOptions={loadProteinOptions}
              defaultOptions={proteinOptions.slice(0, 10)} // Preload the first 10 options
              value={selectedProteinOption}
              onChange={handleProteinChange}
              placeholder="Protein" // Placeholder text
            />
            <AsyncSelect
              styles={customStyles}
              className="go-term-input-container"
              cacheOptions
              loadOptions={loadGoTermOptions}
              defaultOptions={goTermOptions.slice(0, 10)} // Preload the first 10 options
              value={selectedGoTermOption}
              onChange={handleGoTermChange}
              placeholder="Gene Ontology Term" // Placeholder text
            />
            <input
              className="k-input" // User input for k
              type="number"
              min="0"
              name="k"
              placeholder="k"
              value={query.k}
              onChange={handleKInputChange}
              required
            />
            <select
              style={{ width: "180px", backgroundColor: "black" }}
              name="species" // User input for species
              value={query.species}
              onChange={handleSpeciesChange}
            >
              <option value="txid224308">B. subtilis (224308)</option>
              <option value="txid7227">D. melanogaster (7227)</option>
              <option value="txid7955">D. rerio (7955)</option>
            </select>
            <button type="submit" className="search-button" ref={submitRef}>
              Search
            </button>
          </div>
        </div>
      </form>

      {/* change query mode */}
      <div className="mode-container">
        <h4>Mode:</h4>
        <input
          data-tooltip-id="path-tooltip"
          type="button"
          className={
            activeModeButton === "path" ? "active-button" : "inactive-button"
          }
          onClick={handleQueryMode}
          value="Paths"
        />
        <input
          data-tooltip-id="node-tooltip"
          type="button"
          className={
            activeModeButton === "node" ? "active-button" : "inactive-button"
          }
          onClick={handleQueryMode}
          value="Nodes"
        />
        <Modetooltip></Modetooltip>

        {/* user examples */}
        <h4 className="example">
          <i>{spName}</i> Examples:
          <a onClick={() => getExample(1)}>#1</a>{" "}
          <a onClick={() => getExample(2)}>#2</a>{" "}
          <a onClick={() => getExample(3)}>#3</a>
        </h4>
      </div>

      {/* user guide */}
      <button className="guide-button" onClick={handleGuide}>
        ?
      </button>
    </div>
  );
}
