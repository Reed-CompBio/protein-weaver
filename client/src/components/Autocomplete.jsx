import React, { useState } from "react";

export default function Autocomplete(props) {
    const { suggestions, inputName, inputValue, onInputChange, placeholder } =
        props;
    const [active, setActive] = useState(0);
    const [filtered, setFiltered] = useState([]);
    const [isFocused, setIsFocused] = useState(false); // Track input focus
    const [input, setInput] = useState("");

    const onChange = (e) => {
        const inputText = e.currentTarget.value;
        const newFilteredSuggestions = suggestions.filter((suggestion) =>
            suggestion.toLowerCase().includes(inputText.toLowerCase())
        );
        setActive(0);
        setFiltered(newFilteredSuggestions);
        setInput(inputText);
        onInputChange({ target: { name: inputName, value: inputText } });
    };

    const onClick = (e) => {
        setActive(0);
        setFiltered([]);
        setInput(e.currentTarget.innerText);
        setIsFocused(false); // Hide autocomplete on suggestion click
        onInputChange({
            target: { name: inputName, value: e.currentTarget.innerText },
        });
    };

    const onFocus = () => {
        setIsFocused(true); // Show autocomplete when input is in focus
    };

    const onBlur = () => {
        // Delay hiding autocomplete to allow for click on suggestion
        setTimeout(() => {
            setIsFocused(false);
        }, 200);
    };

    const onKeyDown = (e) => {
        if (e.keyCode === 13) {
            // Enter key
            setActive(0);
            setFiltered([]);
            setInput(filtered[active] || input);
            setIsFocused(false); // Hide autocomplete on Enter key
            onInputChange({
                target: { name: inputName, value: filtered[active] || input },
            });
        } else if (e.keyCode === 38) {
            // Up arrow
            setActive(active > 0 ? active - 1 : 0);
        } else if (e.keyCode === 40) {
            // Down arrow
            setActive(
                active < filtered.length - 1 ? active + 1 : filtered.length - 1
            );
        }
    };

    const renderMyAutocomplete = () => {
        if (isFocused && input) {
            if (filtered.length) {
                return (
                    <ul className="autocomplete">
                        {filtered.map((suggestion, index) => {
                            let className = index === active ? "active" : "";
                            return (
                                <li className={className} key={suggestion} onClick={onClick}>
                                    {suggestion}
                                </li>
                            );
                        })}
                    </ul>
                );
            } else {
                return (
                    <div className="no-autocomplete">
                        <em className="not-found">Not found</em>
                    </div>
                );
            }
        }
        return null;
    };

    return (
        <div className="autocomplete-input-container">
            <input
                required
                type="text"
                name={inputName}
                value={inputValue}
                placeholder={placeholder}
                onChange={onChange}
                onFocus={onFocus}
                onBlur={onBlur}
                onKeyDown={onKeyDown}
                autoComplete="off"
            />
            <div className="autocomplete-dropdown">{renderMyAutocomplete()}</div>
        </div>
    );
}