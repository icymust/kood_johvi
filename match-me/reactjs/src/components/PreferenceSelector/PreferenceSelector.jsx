import { useState, useEffect } from "react";
import "./PreferenceSelector.css";
import "../InterestsSelector/InterestsSelector.css";


const PreferenceSelector = ({ label, options, value, onChange }) => {
  const [selectedValues, setSelectedValues] = useState([]);
  const [customOptions, setCustomOptions] = useState([]);
  const [otherInput, setOtherInput] = useState("");

  useEffect(() => {
    const initialSelected = value ? value.split(",").filter(Boolean) : [];
    setSelectedValues(initialSelected);

    // Extract any custom values not in the base options
    const custom = initialSelected.filter((val) => !options.includes(val));
    setCustomOptions(custom);
  }, [value, options]);

  const allOptions = [...options, ...customOptions];

  const handleCheckboxChange = (option) => {
    const updatedValues = selectedValues.includes(option)
      ? selectedValues.filter((item) => item !== option)
      : [...selectedValues, option];

    setSelectedValues(updatedValues);
    onChange(updatedValues.map((v) => v.toLowerCase()).join(","));
  };

  const handleAddOther = () => {
    const trimmedInput = otherInput.trim();
    if (!trimmedInput || allOptions.includes(trimmedInput)) return;

    const updatedCustom = [...customOptions, trimmedInput];
    const updatedValues = [...selectedValues, trimmedInput];

    setCustomOptions(updatedCustom);
    setSelectedValues(updatedValues);
    setOtherInput("");
    onChange(updatedValues.join(","));
  };

  const handleClear = () => {
    setSelectedValues([]);
    setCustomOptions([]);
    setOtherInput("");
    onChange("");
  };

  const formatLabel = (str) =>
    str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  // Event handler for Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission on Enter
      handleAddOther(); // Trigger Add button functionality
    }
  };

  return (
    <div className="preferencesCard">
      <div className="preferencesHeader">
        <h3>{label}:</h3>
        <button className="clearBtn" onClick={handleClear}>
          Clear
        </button>
      </div>
    <div className="preferenceSelector">
     
      <div className="optionsContainer">
        {/* Display checkboxes for all options (including custom ones) */}
        {[...new Set(allOptions.map((o) => o.toLowerCase()))].map((option) => (
          <label key={option}  className={`optionPill ${
            selectedValues.includes(option)
              ? "selected"
              : ""
          }`}>
            <input
              type="checkbox"
              checked={selectedValues.includes(option)}
              onChange={() => handleCheckboxChange(option)}
            />
            {formatLabel(option)}
          </label>
        ))}

        {/* Display the "Other" input field */}
        <div className="otherInputGroup">
          <input
            type="text"
            value={otherInput}
            onChange={(e) => setOtherInput(e.target.value)}
            onKeyDown={handleKeyDown} // Listen for Enter key
            placeholder="Add other..."
          />
          <button type="button" className="addBtn" onClick={handleAddOther}>
            Add
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default PreferenceSelector;
