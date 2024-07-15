import React, { useEffect, useState } from "react";
import { FaInfoCircle } from "react-icons/fa";

export default function AncestorSelector({
    parentGoTerms,
    storeGoTermValue,
    handleInputChangeAncestor,
    inputValueAncestor,
}) {
    const [isEmpty, setIsEmpty] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    // Function to populate datalist with options from the dynamic array
    function populateDatalistWithOptions(array) {
        const datalist = document.getElementById("parent-go-terms");

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

    useEffect(() => {
        populateDatalistWithOptions(parentGoTerms);
    }, [parentGoTerms]);
    // Call the function to populate the datalist

    const onChange = (e) => {
        const inputText = e.currentTarget.value;
        handleInputChangeAncestor(inputText);
        storeGoTermValue(e);
    };

    return (
        <div className="ancestor-input">
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
                                You have reached the most general GO term.
                            </div>
                        )}
                    </div>
                )}
                {/* normal input display */}
                <input
                    list="parent-go-terms"
                    id="ancestor-selector"
                    name="ancestor-selector"
                    onChange={onChange}
                    placeholder="Parent GO Terms"
                    value={inputValueAncestor}
                />
            </div>
            <datalist id="parent-go-terms"></datalist>
        </div>
    );
}
