import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";
import Header from "../components/Header";

const EditListingPage = () => {
  const { id } = useParams(); // Get listing ID from URL
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: "",
    carAge: 0,
    pricePerHour: "",
    fuelType: "Petrol",
    capacity: "",
    transmission: "Automatic",
    location: "",
    availableFrom: "",
    availableTill: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch listing data
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const docRef = doc(db, "car", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            ...data,
            carAge: new Date().getFullYear() - data.year,
            availableFrom: data.availableFrom?.toDate().toISOString().slice(0, 16),
            availableTill: data.availableTill?.toDate().toISOString().slice(0, 16),
          });
        } else {
          setError("Listing not found.");
        }
      } catch (err) {
        console.error("Error fetching listing:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedFormData = { ...formData, [name]: value };

    // Automatically update car age when year changes
    if (name === "year") {
      updatedFormData.carAge = new Date().getFullYear() - Number(value);
    }

    setFormData(updatedFormData);
  };

  // Handle form submission (Update Listing)
  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const docRef = doc(db, "car", id);
      await updateDoc(docRef, {
        ...formData,
        year: Number(formData.year),
        capacity: Number(formData.capacity),
        pricePerHour: Number(formData.pricePerHour),
        carAge: Number(formData.carAge),
        availableFrom: new Date(formData.availableFrom),
        availableTill: new Date(formData.availableTill),
        updatedAt: serverTimestamp(),
      });

      alert("Listing updated successfully!");
      navigate("/listings");
    } catch (err) {
      setError("Failed to update listing.");
      console.error("Update Error:", err);
    }
  };

  // Handle remove listing
  const handleRemove = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this listing?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "car", id));
      alert("Listing removed successfully!");
      navigate("/listings");
    } catch (err) {
      setError("Failed to delete listing.");
      console.error("Delete Error:", err);
    }
  };

  return (
    <>
      <Header />
      <div className="container mx-auto py-10 px-5">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Edit Listing</h1>
          <button className="btn btn-error" onClick={handleRemove}>Remove Listing</button>
        </div>

        {loading ? (
          <p className="text-center text-lg">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="max-w-lg mx-auto bg-white p-6 shadow-md rounded-lg mt-6">
            <form className="space-y-4" onSubmit={handleUpdate}>
              {/* Car Brand */}
              <div>
                <label className="label"><span className="label-text">Car Brand</span></label>
                <input type="text" name="brand" className="input input-bordered w-full" value={formData.brand} onChange={handleChange} required />
              </div>

              {/* Car Model */}
              <div>
                <label className="label"><span className="label-text">Car Model</span></label>
                <input type="text" name="model" className="input input-bordered w-full" value={formData.model} onChange={handleChange} required />
              </div>

              {/* Car Year */}
              <div>
                <label className="label"><span className="label-text">Car Year</span></label>
                <input type="number" name="year" className="input input-bordered w-full" value={formData.year} onChange={handleChange} required />
              </div>

              {/* Car Age (Read-only) */}
              <div>
                <label className="label"><span className="label-text">Car Age</span></label>
                <input type="number" name="carAge" className="input input-bordered w-full" value={formData.carAge} readOnly />
              </div>

              {/* Price Per Hour */}
              <div>
                <label className="label"><span className="label-text">Price Per Hour (₹)</span></label>
                <input type="number" name="pricePerHour" className="input input-bordered w-full" value={formData.pricePerHour} onChange={handleChange} required />
              </div>

              {/* Fuel Type */}
              <div>
                <label className="label"><span className="label-text">Fuel Type</span></label>
                <select name="fuelType" className="select select-bordered w-full" value={formData.fuelType} onChange={handleChange} required>
                  <option>Petrol</option>
                  <option>Diesel</option>
                  <option>Electric</option>
                  <option>Hybrid</option>
                </select>
              </div>

              {/* Capacity */}
              <div>
                <label className="label"><span className="label-text">Capacity</span></label>
                <input type="number" name="capacity" className="input input-bordered w-full" value={formData.capacity} onChange={handleChange} required />
              </div>

              {/* Transmission */}
              <div>
                <label className="label"><span className="label-text">Transmission</span></label>
                <select name="transmission" className="select select-bordered w-full" value={formData.transmission} onChange={handleChange} required>
                  <option>Automatic</option>
                  <option>Manual</option>
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="label"><span className="label-text">Location</span></label>
                <input type="text" name="location" className="input input-bordered w-full" value={formData.location} onChange={handleChange} required />
              </div>

              {/* Available From */}
              <div>
                <label className="label"><span className="label-text">Available From</span></label>
                <input type="datetime-local" name="availableFrom" className="input input-bordered w-full" value={formData.availableFrom} onChange={handleChange} required />
              </div>

              {/* Available Till */}
              <div>
                <label className="label"><span className="label-text">Available Till</span></label>
                <input type="datetime-local" name="availableTill" className="input input-bordered w-full" value={formData.availableTill} onChange={handleChange} required />
              </div>

              {/* Update Button */}
              <div className="text-center mt-4">
                <button type="submit" className="btn btn-primary w-full">Update Listing</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default EditListingPage;
