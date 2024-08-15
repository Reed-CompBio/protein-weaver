import React from "react";

function CheckboxComponent({ handleCheckboxChange, query }) {
    return (
        <div>
            <label>
                <input
                    type="checkbox"
                    name="ppi"
                    checked={query.ppi}
                    onChange={handleCheckboxChange}
                    required={!query.regulatory}
                />
                Protein Protein Interaction
            </label>
            <label>
                <input
                    type="checkbox"
                    name="regulatory"
                    checked={query.regulatory}
                    onChange={handleCheckboxChange}
                    required={!query.ppi}
                />
                Regulatory Interaction
            </label>
        </div>
    );
}

export default CheckboxComponent;
