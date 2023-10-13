import React from 'react';
import PropTypes from 'prop-types';

export default function SearchBar({ handleSubmit, submitRef, query, handleInputChange, getExample }) {


    return (
        <div className="container">
          <form method="post" onSubmit={handleSubmit} ref={submitRef}>
            <div className="wrapper">
              <h2>
                Enter protein, GO term and number of paths to visualize...
              </h2>
              <div className="search-container">
              <input
                  id="protein-input"
                  type="text"
                  name="protein"
                  placeholder="FBgn0031985"
                  value={query.protein}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="goTerm"
                  placeholder="GO:0003674"
                  value={query.goTerm}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="number"
                  min="0"
                  name="k"
                  placeholder="3"
                  value={query.k}
                  onChange={handleInputChange}
                  required
                />
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