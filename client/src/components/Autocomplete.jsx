import React, { useState } from "react";

export default function Autocomplete(props) {
  const { suggestions, inputName, inputValue, onInputChange, placeholder } = props;
  const [active, setActive] = useState(0);
  const [filtered, setFiltered] = useState([]);
  const [isShow, setIsShow] = useState(false);
  const [input, setInput] = useState("");

  const onChange = (e) => {
    const inputText = e.currentTarget.value;
    const newFilteredSuggestions = suggestions.filter(
      (suggestion) =>
        suggestion.toLowerCase().indexOf(inputText.toLowerCase()) > -1
    );
    setActive(0);
    setFiltered(newFilteredSuggestions);
    setIsShow(true);
    setInput(inputText);
    onInputChange({ target: { name: inputName, value: inputText } });
  };

  const onClick = (e) => {
    setActive(0);
    setFiltered([]);
    setIsShow(false);
    const selectedValue = e.currentTarget.innerText;
    setInput(selectedValue);
    onInputChange({ target: { name: inputName, value: selectedValue } });
  };

  const onKeyDown = (e) => {
    if (e.keyCode === 13) {
      // Enter key
      setActive(0);
      setIsShow(false);
      const selectedValue = filtered[active] || input;
      setInput(selectedValue);
      onInputChange({ target: { name: inputName, value: selectedValue } });
    } else if (e.keyCode === 38) {
      // Up arrow
      setActive(active > 0 ? active - 1 : 0);
    } else if (e.keyCode === 40) {
      // Down arrow
      setActive(active < filtered.length - 1 ? active + 1 : filtered.length - 1);
    }
  };

  const renderAutocomplete = () => {
    if (isShow && input) {
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
    return <></>;
  };

  return (
    <div className="autocomplete-input-container">
      <input
        type="text"
        name={inputName}
        value={inputValue}
        placeholder={placeholder}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
      <div className="autocomplete-dropdown">
        {renderAutocomplete()}
      </div>
    </div>
  );
};