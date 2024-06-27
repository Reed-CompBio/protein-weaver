import React, { useState, useEffect } from "react";
import Autocomplete from "./Autocomplete";
import Modetooltip from "./ModeTooltip";
import Select from "react-select";
import AsyncSelect from "react-select/async";

export default function SearchBar({
  handleSubmit,
  submitRef,
  query,
  handleInputChange,
  getExample,
  proteinOptions,
  goTermOptions,
  handleGuide,
  handleSpeciesChange,
  handleQueryMode,
  activeModeButton,
}) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [allOptions, setAllOptions] = useState([]);

  useEffect(() => {
    console.log("fetching suggestion data")
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
        setAllOptions(formattedOptions);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, [query.species]);

  useEffect(() => {
    console.log("useEffect triggered", query.protein)
    console.log(allOptions.length)
    allOptions.map((item) => {
      if (item.value == query.protein && item.value != item.label) {
        console.log("setting label")
        setSelectedOption({
          value: item.value,
          label: item.label,
          type: "protein",
        });
      }
    });
  }, [query.protein]);
  const loadOptions = (inputValue, callback) => {
    if (!inputValue) {
      // If there is no input, return an empty array
      callback([]);
      return;
    }

    // Filter options based on the input value
    const filteredOptions = allOptions.filter((option) =>
      option.label.toLowerCase().includes(inputValue.toLowerCase())
    );
    // Limit the number of options to display
    const limitedOptions = filteredOptions.slice(0, 10); // Limit to 10 options
    callback(limitedOptions);
  };

  const handleChange = (option) => {
    setSelectedOption(option);
    handleInputChange(option);
  };
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
            {/* <Select
              className="basic-single"
              classNamePrefix="select"
              defaultValue={proteinOptions[0]}
              isDisabled={isDisabled}
              isLoading={isLoading}
              isClearable={isClearable}
              isRtl={isRtl}
              isSearchable={isSearchable}
              name="color"
              options={proteinOptions}
            /> */}
            {/* <Select
              // value={selectedOption}1
              // onChange={handleChange}
              options={proteinOptions}
            /> */}
            <AsyncSelect
              className="basic-single"
              cacheOptions
              loadOptions={loadOptions}
              defaultOptions={allOptions.slice(0, 10)} // Preload the first 10 options
              value={selectedOption}
              onChange={handleChange}
              placeholder="Protein" // Placeholder text
            />

            {/* <Autocomplete
            <Autocomplete
              className="protein-input-container"
              suggestions={proteinOptions} // Pass the protein suggestions to the Autocomplete component
              inputName="protein"
              inputValue={query.protein}
              onInputChange={handleInputChange}
              placeholder="Protein"
              autocomplete="protein-autocomplete"
            />
            <Autocomplete
              className="go-term-input-container"
              suggestions={goTermOptions} // Pass the go term suggestions to the Autocomplete component
              inputName="goTerm"
              inputValue={query.goTerm}
              onInputChange={handleInputChange}
              placeholder="GO Term"
              placeholder="Gene Ontology Term"
              autocomplete="go-term-autocomplete"
            /> */}
            <input
              className="k-input" // User input for k
              type="number"
              min="0"
              name="k"
              placeholder="k"
              value={query.k}
              onChange={handleInputChange}
              required
            />
            <select
              style={{ width: "180px" }}
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
          {spName} Examples:
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
