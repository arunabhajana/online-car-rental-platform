import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth, storage } from "../firebaseConfig"; 
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Header from "../components/Header";

const NewListingsPage = () => {
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: "",
    fuelType: "Petrol",
    capacity: "",
    transmission: "Automatic",
    location: "",
  });
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle image selection
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError(null);

    try {
      if (!auth.currentUser) throw new Error("User not authenticated!");

      let imageUrl = "";

      if (image) {
        // Upload image to Firebase Storage
        const storageRef = ref(storage, `car-images/${Date.now()}-${image.name}`);
        const uploadTask = uploadBytesResumable(storageRef, image);

        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            null,
            (error) => reject(error),
            async () => {
              imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
              resolve();
            }
          );
        });
      }

      // Save car listing in Firestore
      await addDoc(collection(db, "cars"), {
        ...formData,
        year: Number(formData.year),
        capacity: Number(formData.capacity),
        imageUrl,
        userId: auth.currentUser.uid,
        timestamp: serverTimestamp(),
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
              <label className="label"><span className="label-text">Capacity</span></label>
              <input type="number" name="capacity" placeholder="Enter capacity (seats)" className="input input-bordered w-full" onChange={handleChange} required />
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

            {/* Image Upload */}
            <div>
              <label className="label"><span className="label-text">Upload Car Image</span></label>
              <input type="file" accept="image/*" className="file-input file-input-bordered w-full" onChange={handleImageChange} required />
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
