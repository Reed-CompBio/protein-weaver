import React, { useEffect, useState } from "react";
import { FaInfoCircle } from "react-icons/fa";

export default function DescendantSelector({
    childrenGoTerms,
    storeGoTermValue,
    handleInputChangeDescendant,
    inputValueDescendant,
}) {
    const [isEmpty, setIsEmpty] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    // Function to populate datalist with options from the dynamic array
    function populateDatalistWithOptions(array) {
        const datalist = document.getElementById("child-go-terms");

        // Clear existing options
        datalist.innerHTML = "";

        if (array.length === 0) {
            setIsEmpty(true);
        } else {
            setIsEmpty(false);
            // Iterate through the array and create options
            array.forEach((optionText) => {
                const option = document.createElement("option");
                option.value = optionText;
                datalist.appendChild(option);
            });
        }
    }

    // Call the function to populate the datalist based on queried GO term
    useEffect(() => {
        populateDatalistWithOptions(childrenGoTerms);
    }, [childrenGoTerms]);

    const onChange = (e) => {
        const inputText = e.currentTarget.value;
        handleInputChangeDescendant(inputText);
        storeGoTermValue(e);
    };

    return (
        <div className="descendant-input">
            <div className="hierarchy-input-container">
                {/* display warning message when at root GO term */}
                {isEmpty && (
                    <div
                        className="info-icon-container"
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                    >
                        <FaInfoCircle className="info-icon" />
                        {showTooltip && (
                            <div className="hierarchy-warning">
                                You have reached the most specific GO term.
                            </div>
                        )}
                    </div>
                )}
                {/* normal input display */}
                <input
                    list="child-go-terms"
                    id="descendant-selector"
                    name="descendant-selector"
                    onChange={onChange}
                    placeholder="Child GO Terms"
                    value={inputValueDescendant}
                />
            </div>
            <datalist id="child-go-terms"></datalist>
        </div>
    );
}
