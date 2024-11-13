import React from 'react';
import './Dropdown.css';

const Dropdown = ({ entries, input = null, category, setinput = null, Input = null, func = null }) => {
  const handleChange = (item, isChecked) => {
    if (category === "location") {
      input(item);
    } else {
      setinput(item, isChecked);
    }
  };

  return (
    <div
      className="dropdown"
      onMouseEnter={() => func(true)}
      onMouseLeave={() => func(false)}
    >
      <ul>
        {entries.map((item, idx) => (
          <li key={idx}>
            {category === "location" ? (
              <div onClick={() => handleChange(item, true)}>{item}</div>
            ) : (
              <label>
                <input
                  type="radio"
                  name={item}
                  id={idx}
                  checked={Input.includes(item)}
                  onChange={(e) => handleChange(item, e.target.checked)}
                />
                <p>{" " + item}</p>
              </label>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dropdown;
