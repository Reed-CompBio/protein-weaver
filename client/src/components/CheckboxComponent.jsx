import React, { useState } from "react";

function CheckboxComponent({checkboxes, setCheckboxes}) {
    // const [checkboxes, setCheckboxes] = useState({
    //     checkbox1: false,
    //     checkbox2: false,
    // });
    const [formValid, setFormValid] = useState(true);

    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;

        setCheckboxes({
            ...checkboxes,
            [name]: checked,
        });

        // Check if the form is valid
        setFormValid(checked || checkboxes.checkbox1 || checkboxes.checkbox2);
    };


    return (
        <div>
            <label>
                <input
                    type="checkbox"
                    name="checkbox1"
                    checked={checkboxes.checkbox1}
                    onChange={handleCheckboxChange}
                    required={!checkboxes.checkbox2}
                />
                Checkbox 1
            </label>
            <label>
                <input
                    type="checkbox"
                    name="checkbox2"
                    checked={checkboxes.checkbox2}
                    onChange={handleCheckboxChange}
                    required={!checkboxes.checkbox1}
                />
                Checkbox 2
            </label>
        </div>
    );
}

export default CheckboxComponent;
