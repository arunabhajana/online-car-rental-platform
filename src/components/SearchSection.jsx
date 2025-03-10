import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchSection = () => {
  const [searchParams, setSearchParams] = useState({
    location: "",
    pickupDate: "",
    dropoffDate: "",
  });

  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
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

  return (
    <div className="flex justify-center mt-10">
      <div className="card bg-base-100 shadow-md p-6 w-full max-w-3xl">
        <div className="card-body">
          <div className="grid grid-cols-3 gap-4">
            {/* Pickup Location */}
            <div>
              <label className="label">Pickup Location</label>
              <input
                type="text"
                name="location"
                placeholder="Enter location"
                className="input input-bordered w-full"
                value={searchParams.location}
                onChange={handleChange}
                required
              />
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

          <div className="text-center mt-4">
            <button className="btn btn-primary w-full" onClick={handleSearch}>
              Search Cars
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchSection;
