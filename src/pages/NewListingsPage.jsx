import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth, storage } from "../firebaseConfig";
import { collection, addDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
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

  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
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

    try {
      if (!auth.currentUser) throw new Error("User not authenticated!");

      // Convert date-time fields to Firestore Timestamp
      const availableFromTimestamp = Timestamp.fromDate(new Date(formData.availableFrom));
      const availableTillTimestamp = Timestamp.fromDate(new Date(formData.availableTill));

      // Upload image & get URL
      let uploadedImageUrl = "noimage";
      if (imageFile) {
        uploadedImageUrl = await uploadImage(imageFile);
      }

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
        imageUrl: uploadedImageUrl, 
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

            {/* Capacity (Added after Fuel Type) */}
            <div>
              <label className="label"><span className="label-text">Seating Capacity</span></label>
              <input type="number" name="capacity" className="input input-bordered w-full" onChange={handleChange} required />
            </div>

            {/* Image Upload */}
            <div>
              <label className="label"><span className="label-text">Upload Car Image</span></label>
              <input type="file" className="file-input file-input-bordered w-full" onChange={handleImageChange} required />
              {imageUrl && (
                <img src={imageUrl} alt="Preview" className="mt-2 w-40 h-40 object-cover rounded-lg" />
              )}
            </div>

            {/* Location */}
            <div>
              <label className="label"><span className="label-text">Location</span></label>
              <input type="text" name="location" className="input input-bordered w-full" onChange={handleChange} required />
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
