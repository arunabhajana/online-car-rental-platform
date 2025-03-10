import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebaseConfig";
import { collection, addDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import Header from "../components/Header";

const NewListingsPage = () => {
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: "",
    carAge: "",
    pricePerHour: "",
    fuelType: "Petrol",
    capacity: "",
    transmission: "Automatic",
    location: "",
    availableFrom: "",
    availableTill: "",
  });

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError(null);

    try {
      if (!auth.currentUser) throw new Error("User not authenticated!");

      // Convert date-time fields to Firestore Timestamp
      const availableFromTimestamp = Timestamp.fromDate(new Date(formData.availableFrom));
      const availableTillTimestamp = Timestamp.fromDate(new Date(formData.availableTill));

      // Save car listing in Firestore
      await addDoc(collection(db, "car"), {
        brand: formData.brand,
        model: formData.model,
        year: Number(formData.year),
        carAge: Number(formData.carAge),
        pricePerHour: Number(formData.pricePerHour),
        fuelType: formData.fuelType,
        capacity: Number(formData.capacity),
        transmission: formData.transmission,
        location: formData.location,
        imageUrl: "noimage",
        ownerId: auth.currentUser.uid,
        availableFrom: availableFromTimestamp,
        availableTill: availableTillTimestamp,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      alert("Car listed successfully!");
      navigate("/listings");
    } catch (err) {
      setError(err.message);
      console.error("Error adding listing:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="container mx-auto py-10 px-5">
        <h1 className="text-3xl font-bold text-center mb-8">Create New Listing</h1>
        <div className="max-w-lg mx-auto bg-white p-6 shadow-md rounded-lg">
          {error && (
            <div role="alert" className="alert alert-error">
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Car Brand */}
            <div>
              <label className="label"><span className="label-text">Car Brand</span></label>
              <input type="text" name="brand" placeholder="Enter car brand" className="input input-bordered w-full" onChange={handleChange} required />
            </div>

            {/* Car Model */}
            <div>
              <label className="label"><span className="label-text">Car Model</span></label>
              <input type="text" name="model" placeholder="Enter car model" className="input input-bordered w-full" onChange={handleChange} required />
            </div>

            {/* Car Year */}
            <div>
              <label className="label"><span className="label-text">Car Year</span></label>
              <input type="number" name="year" placeholder="Enter car year" className="input input-bordered w-full" onChange={handleChange} required />
            </div>

            {/* Car Age */}
            <div>
              <label className="label"><span className="label-text">Car Age (years)</span></label>
              <input type="number" name="carAge" placeholder="Enter car age" className="input input-bordered w-full" onChange={handleChange} required />
            </div>

            {/* Price Per Hour */}
            <div>
              <label className="label"><span className="label-text">Price Per Hour (₹)</span></label>
              <input type="number" name="pricePerHour" placeholder="Enter price per hour" className="input input-bordered w-full" onChange={handleChange} required />
            </div>

            {/* Fuel Type */}
            <div>
              <label className="label"><span className="label-text">Fuel Type</span></label>
              <select name="fuelType" className="select select-bordered w-full" onChange={handleChange} required>
                <option>Petrol</option>
                <option>Diesel</option>
                <option>Electric</option>
                <option>Hybrid</option>
              </select>
            </div>

            {/* Capacity */}
            <div>
              <label className="label"><span className="label-text">Capacity (Seats)</span></label>
              <input type="number" name="capacity" placeholder="Enter seating capacity" className="input input-bordered w-full" onChange={handleChange} required />
            </div>

            {/* Transmission */}
            <div>
              <label className="label"><span className="label-text">Transmission</span></label>
              <select name="transmission" className="select select-bordered w-full" onChange={handleChange} required>
                <option>Automatic</option>
                <option>Manual</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="label"><span className="label-text">Location</span></label>
              <input type="text" name="location" placeholder="Enter location" className="input input-bordered w-full" onChange={handleChange} required />
            </div>

            {/* Available From */}
            <div>
              <label className="label"><span className="label-text">Available From</span></label>
              <input type="datetime-local" name="availableFrom" className="input input-bordered w-full" onChange={handleChange} required />
            </div>

            {/* Available Till */}
            <div>
              <label className="label"><span className="label-text">Available Till</span></label>
              <input type="datetime-local" name="availableTill" className="input input-bordered w-full" onChange={handleChange} required />
            </div>

            {/* Submit Button */}
            <div className="text-center mt-4">
              <button type="submit" className="btn btn-primary w-full" disabled={uploading}>
                {uploading ? "Uploading..." : "Submit Listing"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default NewListingsPage;
