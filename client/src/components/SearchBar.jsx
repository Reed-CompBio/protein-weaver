import React from 'react';
import PropTypes from 'prop-types';
import Autocomplete from './Autocomplete';

export default function SearchBar({ handleSubmit, submitRef, query, handleInputChange, getExample }) {


  return (
    <div className="container">
      <form method="post" onSubmit={handleSubmit} ref={submitRef}>
        <div className="wrapper">
          <h2>
            Enter protein, GO term and number of paths to visualize...
          </h2>
          <div className="search-container">
            <Autocomplete
              suggestions={["flw", "egfr"]} // Pass the protein suggestions to the Autocomplete component
              inputName="protein"
              inputValue={query.protein}
              onInputChange={handleInputChange}
              placeholder="FBgn0031985"
            />
            <Autocomplete
              suggestions={["wnt signaling pathway", "biological process", "example1", "example2", "example3", "example4", "example5"]} // Pass the go term suggestions to the Autocomplete component
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
            &nbsp;&nbsp;&nbsp;
            <button type="submit" className="button">
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
  )
};