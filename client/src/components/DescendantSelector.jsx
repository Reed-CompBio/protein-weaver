import React, { useEffect, useState } from 'react';
import { FaInfoCircle } from "react-icons/fa";

export default function DescendantSelector({
    childrenGoTerms,
    storeGoTermValue
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
            array.forEach(optionText => {
                const option = document.createElement("option");
                option.value = optionText;
                datalist.appendChild(option);
            });
        }
    }

    useEffect(() => {
        populateDatalistWithOptions(childrenGoTerms);
    }, [childrenGoTerms]);
    // Call the function to populate the datalist

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
                        {showTooltip && <div className="hierarchy-warning">You have reached the most specific GO term.</div>}
                    </div>
                )}

                <input
                    list="child-go-terms"
                    id="descendant-selector"
                    name="descendant-selector"
                    onChange={storeGoTermValue}
                    placeholder='Child GO Terms'
                />
            </div>
            <datalist id="child-go-terms"></datalist>
        </div>
    )
}
