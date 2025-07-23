import React from "react";

export default function CheckboxComponent({ handleCheckboxChange, query }) {
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
                <span className="search-checkbox-text">Physical</span>
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
                <span className="search-checkbox-text">Regulatory</span>
            </label>
        </div>
    );
};