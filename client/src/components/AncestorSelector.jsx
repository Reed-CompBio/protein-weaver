import { React, useEffect } from 'react';
import MyAutocomplete from './MyAutocomplete';
// import { TbChevronCompactDown, TbChevronCompactUp } from 'react-icons/tb';
// import { IconContext } from 'react-icons';

export default function AncestorSelector({
    parentGoTerms,
    handleGoTermChange
}) {
    // Function to populate datalist with options from the dynamic array
    function populateDatalistWithOptions(array) {
        const datalist = document.getElementById("parent-go-terms");

        // Clear existing options
        datalist.innerHTML = "";

        // Iterate through the array and create options
        array.forEach(optionText => {
            const option = document.createElement("option");
            option.value = optionText;
            datalist.appendChild(option);
        });
    }

    useEffect(() => {
        populateDatalistWithOptions(parentGoTerms);
    }, [parentGoTerms]);
    // Call the function to populate the datalist


    return (
        <div className="ancestor-input">
            {/* <label htmlFor="ancestor-selector">Parent GO Terms:</label> */}
            <input
                list="parent-go-terms"
                id="ancestor-selector"
                name="ancestor-selector"
                onChange={handleGoTermChange}
                placeholder='Parent GO Terms'
            />
            <datalist id="parent-go-terms"></datalist>
        </div>
    )
}