import React from "react";
import Autocomplete from "./Autocomplete";

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
}) {
  return (
    <div className="container">
      <div className="title-guide-container">
        <h2>Enter protein, GO term and number of paths to visualize...</h2>
        <button className="guide-button" onClick={handleGuide}>
          ?
        </button>
      </div>
      <form method="post" onSubmit={handleSubmit}>
        <div className="wrapper">
          <div className="search-container">
            <Autocomplete
              suggestions={proteinOptions} // Pass the protein suggestions to the Autocomplete component
              inputName="protein"
              inputValue={query.protein}
              onInputChange={handleInputChange}
              placeholder="FBgn0031985"
            />
            <Autocomplete
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
              <option value="txid7227">D. melanogaster</option>
              <option value="txid224308">B. subtilis</option>
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
