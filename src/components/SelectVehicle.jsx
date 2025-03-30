import React, { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { FaGasPump, FaCogs, FaUsers, FaCalendarAlt } from "react-icons/fa";
import { format } from "date-fns";

const SelectVehicle = ({ nextStep, car, setBookingDetails }) => {
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [dropoffDate, setDropoffDate] = useState("");
  const [dropoffTime, setDropoffTime] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [error, setError] = useState("");
  const [locationOptions, setLocationOptions] = useState([]);

  // Convert Firebase timestamps to readable format
  const availableFrom = car?.availableFrom?.toDate ? format(car.availableFrom.toDate(), "yyyy-MM-dd HH:mm") : null;
  const availableTill = car?.availableTill?.toDate ? format(car.availableTill.toDate(), "yyyy-MM-dd HH:mm") : null;

  // Define location-based pickup/dropoff options
  const locationMappings = {
    Hyderabad: [
      "Ameerpet", "Miyapur", "Gachibowli", "LB Nagar", "Uppal", "Tarnaka", "Madhapur",
      "Secunderabad", "Paradise", "Malakpet", "Nampally", "Khairatabad", "Kukatpally", "JNTU"
    ],
    Chennai: [
      "Tambaram", "Meenambakkam", "Pallavaram", "Chrompet", "Anna Nagar", "Guduvanchery",
      "T. Nagar", "Guindy", "Velachery", "Adyar", "Perambur"
    ],
  };

  // Set location options based on car's location
  useEffect(() => {
    if (car?.location && locationMappings[car.location]) {
      setLocationOptions(locationMappings[car.location]);
    } else {
      setLocationOptions([]); // Default to empty if no matching location
    }
  }, [car]);

  // Check if the selected date is within availability
  const isWithinAvailability = (date) => {
    if (!car.availableFrom || !car.availableTill) return false;
    const from = car.availableFrom.toDate();
    const till = car.availableTill.toDate();
    const selectedDate = new Date(date);
    return selectedDate >= from && selectedDate <= till;
  };

  // Validate selection before proceeding
  const handleContinue = () => {
    if (!pickupDate || !dropoffDate || !pickupTime || !dropoffTime || !pickupLocation || !dropoffLocation) {
      setError("Please fill all fields before proceeding.");
      return;
    }

    if (!isWithinAvailability(pickupDate) || !isWithinAvailability(dropoffDate)) {
      setError("Selected dates are outside the car's availability range.");
      return;
    }

    setError("");
    setBookingDetails({ pickupDate, pickupTime, dropoffDate, dropoffTime, pickupLocation, dropoffLocation });
    nextStep();
  };

  return (
    <>
      <Card className="p-6 shadow-lg rounded-lg mb-6 w-full text-center">
        <img src={car.imageUrl} alt={car.model} className="rounded-lg mx-auto mb-4 w-80 h-52 object-cover" />
        <h2 className="text-2xl font-semibold mb-4">
          {car.brand} {car.model} ({car.year})
        </h2>

        <div className="space-y-2 text-lg">
          <p className="flex items-center justify-center gap-2">
            <FaGasPump className="text-gray-600" /> {car.fuelType}
          </p>
          <p className="flex items-center justify-center gap-2">
            <FaCogs className="text-gray-600" /> {car.transmission}
          </p>
          <p className="flex items-center justify-center gap-2">
            <FaUsers className="text-gray-600" /> {car.capacity} Seats
          </p>

          {availableFrom && availableTill ? (
            <p className="flex items-center justify-center gap-2 text-green-600 font-semibold">
              <FaCalendarAlt /> Available: {availableFrom} - {availableTill}
            </p>
          ) : (
            <p className="text-red-500">Availability not provided.</p>
          )}
        </div>
      </Card>

      <Card className="p-6 shadow-lg rounded-lg mb-6">
        <h2 className="text-2xl font-semibold mb-4">Select Pickup and Dropoff Details</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-lg font-semibold mb-2">Pickup Date</label>
            <input
              type="date"
              className="input input-bordered w-full"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-lg font-semibold mb-2">Pickup Time</label>
            <input
              type="time"
              className="input input-bordered w-full"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-lg font-semibold mb-2">Dropoff Date</label>
            <input
              type="date"
              className="input input-bordered w-full"
              value={dropoffDate}
              onChange={(e) => setDropoffDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-lg font-semibold mb-2">Dropoff Time</label>
            <input
              type="time"
              className="input input-bordered w-full"
              value={dropoffTime}
              onChange={(e) => setDropoffTime(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-lg font-semibold mb-2">Pickup Location</label>
            <select
              className="select select-bordered w-full"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
            >
              <option value="">Select a location</option>
              {locationOptions.length > 0 ? (
                locationOptions.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))
              ) : (
                <option disabled>No locations available</option>
              )}
            </select>
          </div>

          <div>
            <label className="block text-lg font-semibold mb-2">Dropoff Location</label>
            <select
              className="select select-bordered w-full"
              value={dropoffLocation}
              onChange={(e) => setDropoffLocation(e.target.value)}
            >
              <option value="">Select a location</option>
              {locationOptions.length > 0 ? (
                locationOptions.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))
              ) : (
                <option disabled>No locations available</option>
              )}
            </select>
          </div>
        </div>

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </Card>

      <div className="flex justify-center">
        <button className="btn btn-success w-60" onClick={handleContinue}>
          Continue
        </button>
      </div>
    </>
  );
};

export default SelectVehicle;
