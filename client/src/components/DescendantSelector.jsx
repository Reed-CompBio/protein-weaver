import { React, useEffect } from 'react';
// import { TbChevronCompactDown, TbChevronCompactUp } from 'react-icons/tb';
// import { IconContext } from 'react-icons';

export default function DescendantSelector({
    childrenGoTerms,
    handleGoTermChange
}) {
    // Function to populate datalist with options from the dynamic array
    function populateDatalistWithOptions(array) {
        const datalist = document.getElementById("child-go-terms");

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
        populateDatalistWithOptions(childrenGoTerms);
    }, [childrenGoTerms]);
    // Call the function to populate the datalist


    return (
        <div className="descendant-input">
            {/* <label htmlFor="descendant-selector">Child GO Terms:</label> */}
            <input
                list="child-go-terms"
                id="descendant-selector"
                name="descendant-selector"
                onChange={handleGoTermChange}
                placeholder='Child GO Terms'
            />
            <datalist id="child-go-terms"></datalist>
        </div>
    )
}