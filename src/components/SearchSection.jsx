import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const cityList = [
  "Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata",
  "Pune", "Hyderabad", "Ahmedabad", "Jaipur", "Surat",
  "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane"
];

const SearchSection = () => {
  const [searchParams, setSearchParams] = useState({
    location: "",
    pickupDate: "",
    dropoffDate: "",
  });
  const [filteredCities, setFilteredCities] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const navigate = useNavigate();

  // Handle input changes & filter suggestions
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({ ...searchParams, [name]: value });

    if (name === "location") {
      if (value.length > 0) {
        const filtered = cityList.filter((city) =>
          city.toLowerCase().startsWith(value.toLowerCase())
        );
        setFilteredCities(filtered);
      } else {
        setFilteredCities([]);
      }
    }
  };

  // Handle selecting a city
  const handleSelectCity = (city) => {
    setSearchParams({ ...searchParams, location: city });
    setFilteredCities([]);
  };

  // Handle search
  const handleSearch = () => {
    if (!searchParams.location || !searchParams.pickupDate || !searchParams.dropoffDate) {
      alert("Please fill all fields.");
      return;
    }

    navigate(
      `/search-results?location=${searchParams.location}&pickupDate=${searchParams.pickupDate}&dropoffDate=${searchParams.dropoffDate}`
    );
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (filteredCities.length === 0) return;

    if (e.key === "ArrowDown") {
      setHighlightedIndex((prev) => (prev < filteredCities.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter") {
      if (highlightedIndex >= 0) {
        handleSelectCity(filteredCities[highlightedIndex]);
      }
    }
  };

  return (
    <div className="flex justify-center mt-10">
      <div className="card bg-base-100 shadow-md p-6 w-full max-w-3xl">
        <div className="card-body">
          <div className="grid grid-cols-3 gap-4">
            
            {/* Pickup Location with Autosuggestions */}
            <div className="relative">
              <label className="label">Pickup Location</label>
              <input
                type="text"
                name="location"
                placeholder="Enter location"
                className="input input-bordered w-full"
                value={searchParams.location}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                required
              />
              
              {/* Autosuggestion Dropdown */}
              {filteredCities.length > 0 && (
                <ul className="suggestion-box absolute w-full bg-white border border-gray-300 mt-1 rounded-lg shadow-lg">
                  {filteredCities.map((city, index) => (
                    <li
                      key={index}
                      onClick={() => handleSelectCity(city)}
                      className={`p-2 cursor-pointer hover:bg-gray-200 ${
                        highlightedIndex === index ? "bg-gray-300" : ""
                      }`}
                    >
                      {city}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Pickup Date */}
            <div>
              <label className="label">Pickup Date</label>
              <input
                type="date"
                name="pickupDate"
                className="input input-bordered w-full"
                value={searchParams.pickupDate}
                onChange={handleChange}
                required
              />
            </div>

            {/* Dropoff Date */}
            <div>
              <label className="label">Dropoff Date</label>
              <input
                type="date"
                name="dropoffDate"
                className="input input-bordered w-full"
                value={searchParams.dropoffDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Search Button */}
          <div className="text-center mt-4">
            <button className="btn btn-primary w-full" onClick={handleSearch}>
              Search Cars
            </button>
          </div>
        </div>
      </div>

      {/* Styles for Autosuggestions */}
      <style>{`
        .suggestion-box {
          max-height: 200px;
          overflow-y: auto;
          z-index: 10;
        }
      `}</style>
    </div>
  );
};

export default SearchSection;
