import React, { useEffect, useState } from "react";

function CheckboxComponent({ relationshipType, setRelationshipType, handleCheckboxChange }) {
    // const [checkboxes, setCheckboxes] = useState({
    //     checkbox1: false,
    //     checkbox2: false,
    // });
    // const [formValid, setFormValid] = useState(true);

    // useEffect(() => {
    //     console.log(relationshipType);
    // }, [relationshipType]);

    // const handleCheckboxChange = (event) => {
    //     const { name, checked } = event.target;

    //     setRelationshipType({
    //         ...relationshipType,
    //         [name]: checked,
    //     });

    //     // Check if the form is valid
    //     setFormValid(checked || relationshipType.ppi || relationshipType.regulatory);
    // };

    return (
        <div>
            <label>
                <input
                    type="checkbox"
                    name="ppi"
                    checked={relationshipType.ppi}
                    onChange={handleCheckboxChange}
                    required={!relationshipType.regulatory}
                />
                Protein Protein Interaction
            </label>
            <label>
                <input
                    type="checkbox"
                    name="regulatory"
                    checked={relationshipType.regulatory}
                    onChange={handleCheckboxChange}
                    required={!relationshipType.ppi}
                />
                Regulatory Interaction
            </label>
        </div>
    );
}

export default CheckboxComponent;
