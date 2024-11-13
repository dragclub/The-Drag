import React, { useState } from "react";
import "./CustomDropdown.css";

const CustomDropdown = ({ options, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div className="custom-dropdown">
      <div className="dropdown-header" onClick={toggleDropdown}>
        {selectedOption || "Select DealType"}
      </div>
      {isOpen && (
        <div className="dropdown-list">
          {options.map((option, idx) => (
            <div
              key={idx}
              className="dropdown-option"
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
