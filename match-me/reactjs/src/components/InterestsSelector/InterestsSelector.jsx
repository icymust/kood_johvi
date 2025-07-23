import { useState, useEffect } from "react";
import "./InterestsSelector.css";

const InterestsSelector = ({ categories, value, onChange }) => {
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [selectedValues, setSelectedValues] = useState({});
  const [customOptions, setCustomOptions] = useState({});
  const [otherInputs, setOtherInputs] = useState({});

  useEffect(() => {
    if (value && typeof value === "object") {
      setSelectedValues(value);

      const newCustomOptions = {};
      for (const category in value) {
        const defaults = categories[category] || [];
        const customs = value[category].filter(
          (item) => !defaults.includes(item)
        );
        newCustomOptions[category] = customs;
      }
      setCustomOptions(newCustomOptions);
    } else {
      setSelectedValues({});
      setCustomOptions({});
    }
  }, [value, categories]);

  const toggleDropdown = (category) => {
    setDropdownOpen(dropdownOpen === category ? null : category);
  };

  const formatLabel = (str) =>
    str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const handleCheckboxChange = (category, option) => {
    const current = selectedValues[category] || [];
    const updated = current.includes(option)
      ? current.filter((item) => item !== option)
      : [...current, option];

    const newValues = { ...selectedValues, [category]: updated };
    setSelectedValues(newValues);
    onChange(newValues);
  };

  const handleOtherInputChange = (category, text) => {
    setOtherInputs((prev) => ({ ...prev, [category]: text }));
  };

  const handleAddOther = (category) => {
    if (!otherInputs[category]) return;

    const formatted = formatLabel(otherInputs[category].trim());
    const current = selectedValues[category] || [];

    // Prevent duplicates
    if (current.includes(formatted)) return;

    const newValues = {
      ...selectedValues,
      [category]: [...current, formatted],
    };

    setSelectedValues(newValues);
    setOtherInputs((prev) => ({ ...prev, [category]: "" }));
    onChange(newValues);
  };

  const handleClear = () => {
    setSelectedValues({});
    setOtherInputs({});
    setCustomOptions({});
    onChange({});
  };

  const handleKeyDown = (e, category) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddOther(category);
    }
  };

  return (
    <div className="interestsCard">
      <div className="interestsHeader">
        <h3>Interests</h3>
        <button className="clearBtn" onClick={handleClear}>
          Clear All
        </button>
      </div>

      {Object.entries(categories).map(([category, baseOptions]) => {
        const custom = customOptions[category] || [];
        const allOptions = [...new Set([...baseOptions, ...custom])];

        return (
          <div key={category} className="categorySection">
            <div
              className="categoryTitle"
              onClick={() => toggleDropdown(category)}
            >
              {category}
              <span
                className={`arrow ${dropdownOpen === category ? "up" : "down"}`}
              ></span>
            </div>

            {dropdownOpen === category && (
              <div className="optionsContainer">
                {allOptions.map((option) => (
                  <label
                    key={option}
                    className={`optionPill ${
                      selectedValues[category]?.includes(option)
                        ? "selected"
                        : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={
                        selectedValues[category]?.includes(option) || false
                      }
                      onChange={() => handleCheckboxChange(category, option)}
                    />
                    {formatLabel(option)}
                  </label>
                ))}
                <div className="otherInputGroup">
                  <input
                    type="text"
                    value={otherInputs[category] || ""}
                    onChange={(e) =>
                      handleOtherInputChange(category, e.target.value)
                    }
                    onKeyDown={(e) => handleKeyDown(e, category)}
                    placeholder="Add other..."
                    className="otherInput"
                  />
                  <button
                    type="button"
                    className="addBtn"
                    onClick={() => handleAddOther(category)}
                  >
                    Add
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default InterestsSelector;
