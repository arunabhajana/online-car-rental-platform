import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth, storage } from "../firebaseConfig";
import { collection, addDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { motion, AnimatePresence } from "framer-motion"; // Import Framer Motion
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

  const cities = ["Hyderabad", "Chennai", "Bangalore", "Mumbai", "Delhi"];

  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file)); // Show image preview
    }
  };

  // Upload image & get URL
  const uploadImage = async (file) => {
    if (!file) return null;

    const storageRef = ref(storage, `cars/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        null,
        (error) => reject(error),
        async () => {
          const downloadURL = await getDownloadURL(storageRef);
          resolve(downloadURL);
        }
      );
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!auth.currentUser) throw new Error("User not authenticated!");

      const availableFromTimestamp = Timestamp.fromDate(new Date(formData.availableFrom));
      const availableTillTimestamp = Timestamp.fromDate(new Date(formData.availableTill));

      let uploadedImageUrl = "noimage";
      if (imageFile) {
        uploadedImageUrl = await uploadImage(imageFile);
      }

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
        imageUrl: uploadedImageUrl,
        ownerId: auth.currentUser.uid,
        availableFrom: availableFromTimestamp,
        availableTill: availableTillTimestamp,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setSuccess(true);
      setTimeout(() => {
        navigate("/listings");
      }, 5000);
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

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                transition={{ duration: 0.3 }}
                role="alert"
                className="alert alert-error fixed bottom-5 left-1/2 transform -translate-x-1/2 w-96"
              >
                <span>{error}</span>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                transition={{ duration: 0.3 }}
                role="alert"
                className="alert alert-success fixed bottom-5 left-1/2 transform -translate-x-1/2 w-96 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Car listed successfully! Redirecting...</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Car Brand */}
            <div>
              <label className="label"><span className="label-text">Car Brand</span></label>
              <input type="text" name="brand" className="input input-bordered w-full" onChange={handleChange} required />
            </div>

            {/* Car Model */}
            <div>
              <label className="label"><span className="label-text">Car Model</span></label>
              <input type="text" name="model" className="input input-bordered w-full" onChange={handleChange} required />
            </div>

            {/* Year */}
            <div>
              <label className="label"><span className="label-text">Car Year</span></label>
              <input type="number" name="year" className="input input-bordered w-full" onChange={handleChange} required />
            </div>

            {/* Car Age */}
            <div>
              <label className="label"><span className="label-text">Car Age (years)</span></label>
              <input type="number" name="carAge" className="input input-bordered w-full" onChange={handleChange} required />
            </div>

            {/* Price Per Hour */}
            <div>
              <label className="label"><span className="label-text">Price Per Hour (₹)</span></label>
              <input type="number" name="pricePerHour" className="input input-bordered w-full" onChange={handleChange} required />
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

            {/* Transmission Type */}
            <div>
              <label className="label"><span className="label-text">Transmission Type</span></label>
              <select
                name="transmission"
                className="select select-bordered w-full"
                onChange={handleChange}
                value={formData.transmission}
                required
              >
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
            </div>


            {/* Capacity */}
            <div>
              <label className="label"><span className="label-text">Seating Capacity</span></label>
              <input type="number" name="capacity" className="input input-bordered w-full" onChange={handleChange} required />
            </div>

            {/* Image Upload */}
            <div>
              <label className="label"><span className="label-text">Upload Car Image</span></label>
              <input type="file" className="file-input file-input-bordered w-full" onChange={handleImageChange} required />
              {imageUrl && <img src={imageUrl} alt="Preview" className="mt-2 w-40 h-40 object-cover rounded-lg" />}
            </div>

            {/* Location Dropdown */}
            <div>
              <label className="label"><span className="label-text">Location</span></label>
              <select
                name="location"
                className="select select-bordered w-full"
                onChange={handleChange}
                required
              >
                <option value="">Select a city</option>
                {cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label"><span className="label-text">Available From</span></label>
              <input
                type="datetime-local"
                name="availableFrom"
                className="input input-bordered w-full"
                onChange={handleChange}
                required
              />
            </div>

            {/* Available Till */}
            <div>
              <label className="label"><span className="label-text">Available Till</span></label>
              <input
                type="datetime-local"
                name="availableTill"
                className="input input-bordered w-full"
                onChange={handleChange}
                required
              />
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
