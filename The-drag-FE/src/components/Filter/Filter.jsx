
import React, { useState } from "react";
import "./Filter.css";
import categories from "../../assets/categories";
import dotenv from "dotenv";
import { IoClose } from "react-icons/io5";
dotenv.config();

const Filter = ({ helper, loading, close }) => {
  const [sort, setSort] = useState("des");
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [platform, setPlatform] = useState("");
  const [count, setCount] = useState("");
  const [showWarning, setShowWarning] = useState(false);

  const isAnyFieldSelected = () => {
    return sort || type || location || platform || count;
  };

  const filter = () => {
    const data = {
      type,
      count,
      sort,
      location,
      platform,
    };
    helper(data);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isAnyFieldSelected()) {
      filter();
      close();
    } else {
      setShowWarning(true); 
    }
  };

  return (
    <div className="filter-popup">
      <h3>Search Filters</h3>
      <form className="filter-form" target="_blank" onSubmit={handleSubmit}>
        <div className="sort">
          <label htmlFor="sort">Sort by</label>
          <select
            name="sort"
            id="sort"
            onChange={(e) => {
              setSort(e.target.value);
              setShowWarning(false);
            }}
            value={sort}
          >
            <option value="">Select an Option</option>
            <option value="asc">Ascending (Followers)</option>
            <option value="des">Descending (Followers)</option>
          </select>
        </div>

        <div className="types">
          <label htmlFor="type">Type</label>
          <select
            name="type"
            id="type"
            onChange={(e) => {
              setType(e.target.value);
              setShowWarning(false);
            }}
            value={type}
            className="type-option"
          >
            <option value="">Select an Option</option>
            {categories.map((ele, idx) => (
              <option  key={idx} value={ele}>
                {ele}
              </option>
            ))}
          </select>
        </div>

        <div className="location">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            name="location"
            id="location"
            placeholder="Write Location"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              setShowWarning(false);
            }}
          />
        </div>

        <div className="platform">
          <label htmlFor="platform">Platform</label>
          <select
            name="platform"
            id="platform"
            onChange={(e) => {
              setPlatform(e.target.value);
              setShowWarning(false);
            }}
            value={platform}
          >
            <option value="">Select an Option</option>
            <option value="insta">Instagram</option>
            <option value="linkedin">LinkedIn</option>
            <option value="facebook">Facebook</option>
            <option value="twitter">Twitter</option>
            <option value="youtube">YouTube</option>
          </select>
        </div>

        <div className="follower-count">
          <label htmlFor="follower-count">Followers</label>
          <select
            name="count"
            id="count"
            onChange={(e) => {
              setCount(e.target.value);
              setShowWarning(false);
            }}
            value={count}
          >
            <option value="">Select an Option</option>
            <option value="1-1000">1 - 1000</option>
            <option value="1000-5000">1000 - 5000</option>
            <option value="5000-10000">5000 - 10,000</option>
            <option value="10000-50000">10,000 - 50,000</option>
            <option value="50000-100000">50,000 - 100000</option>
            <option value="100000-500000">100000 - 500000</option>
            <option value="500000-700000">500000 - 700000</option>
            <option value="700000-1000000">700000 - 1000000</option>
            <option value="1000000-">Above 1000000</option>
          </select>
        </div>
        <div className="done">
          <button type="submit">Done</button>
        </div>

        {showWarning && (
          <p className="warning">
            Please select at least one option before proceeding.
          </p>
        )}
      </form>
      <IoClose className="close1" onClick={() => close()} />
    </div>
  );
};

export default Filter;
