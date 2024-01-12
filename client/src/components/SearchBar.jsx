import React from "react";
import MyAutocomplete from "./MyAutocomplete";
import Modetooltip from "./ModeTooltip";

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
  return (
    <div className="container">
      <h2 className="query-title">
        {" "}
        Explore Protein Interaction Networks in GO Term Context
      </h2>
      <div className="title-guide-container">
        <h3>Enter protein, GO term and number of paths to visualize...</h3>
        <button className="guide-button" onClick={handleGuide}>
          ?
        </button>
      </div>
      <form method="post" onSubmit={handleSubmit}>
        <div className="wrapper">
          <div className="search-container">
            <div className="container-mode">
              <h4>Select Mode:</h4>
              <div className="container-mode-button">
                <input
                  data-tooltip-id="path-tooltip"
                  type="button"
                  className={
                    activeModeButton === "path"
                      ? "active-button"
                      : "inactive-button"
                  }
                  onClick={handleQueryMode}
                  value="K Unique Paths"
                />
                <input
                  data-tooltip-id="node-tooltip"
                  type="button"
                  className={
                    activeModeButton === "node"
                      ? "active-button"
                      : "inactive-button"
                  }
                  onClick={handleQueryMode}
                  value="K Unique Nodes"
                />
                <Modetooltip></Modetooltip>
              </div>
            </div>
            <MyAutocomplete
              suggestions={proteinOptions} // Pass the protein suggestions to the Autocomplete component
              inputName="protein"
              inputValue={query.protein}
              onInputChange={handleInputChange}
              placeholder="FBgn0031985"
            />
            <MyAutocomplete
              suggestions={goTermOptions} // Pass the go term suggestions to the Autocomplete component
              inputName="goTerm"
              inputValue={query.goTerm}
              onInputChange={handleInputChange}
              placeholder="GO:0003674"
            />
            <input
              className="k-input"
              type="number"
              min="0"
              name="k"
              placeholder="3"
              value={query.k}
              onChange={handleInputChange}
              required
            />
            <select
              name="species"
              value={query.species}
              onChange={handleSpeciesChange}
            >
              <option value="txid224308">B. subtilis</option>
              <option value="txid7227">D. melanogaster</option>
              <option value="txid7955">D. rerio</option>
            </select>
            <button type="submit" className="search-button" ref={submitRef}>
              Search
            </button>
          </div>
        </div>
      </form>
      <p className="example">
        Examples: <a onClick={() => getExample(1)}>#1</a>{" "}
        <a onClick={() => getExample(2)}>#2</a>{" "}
        <a onClick={() => getExample(3)}>#3</a>
      </p>
    </div>
  );
}
