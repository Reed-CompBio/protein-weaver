import React from "react";

function CheckboxComponent({ handleCheckboxChange, query }) {
    return (
        <div className="checkbox-container">
            <label className="search-box-pair">
                <input
                    className="search-checkbox"
                    type="checkbox"
                    name="ppi"
                    checked={query.ppi}
                    onChange={handleCheckboxChange}
                    required={!query.regulatory}
                />
                Protein-Protein
            </label>
            <label className="search-box-pair">
                <input
                    className="search-checkbox"
                    type="checkbox"
                    name="regulatory"
                    checked={query.regulatory}
                    onChange={handleCheckboxChange}
                    required={!query.ppi}
                />
                Regulatory
            </label>
        </div>
    );
}

export default CheckboxComponent;
