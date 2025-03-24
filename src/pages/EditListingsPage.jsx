import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebaseConfig";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/Header";
import { ProgressSpinner } from "primereact/progressspinner";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const EditListingPage = () => {
  const { id } = useParams();
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
    imageUrl: "",
  });

  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // ✅ Success & Error Message States
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

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
          setErrorMessage("Listing not found.");
        }
      } catch (err) {
        console.error("Error fetching listing:", err);
        setErrorMessage(err.message);
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

    if (name === "year") {
      updatedFormData.carAge = new Date().getFullYear() - Number(value);
    }

    setFormData(updatedFormData);
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setFormData({ ...formData, imageUrl: URL.createObjectURL(file) });
    }
  };

  // Upload image to Firebase Storage
  const uploadImage = async (file) => {
    if (!file) return formData.imageUrl;

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

  // Handle form submission (Update Listing)
  // Handle form submission (Update Listing)
  const handleUpdate = async (e) => {
    e.preventDefault();
    setUploading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      let uploadedImageUrl = formData.imageUrl;
      if (imageFile) {
        uploadedImageUrl = await uploadImage(imageFile);
      }

      const docRef = doc(db, "car", id);
      await updateDoc(docRef, {
        ...formData,
        year: Number(formData.year),
        capacity: Number(formData.capacity),
        pricePerHour: Number(formData.pricePerHour),
        carAge: Number(formData.carAge),
        availableFrom: new Date(formData.availableFrom),
        availableTill: new Date(formData.availableTill),
        imageUrl: uploadedImageUrl,
        updatedAt: serverTimestamp(),
      });

      setSuccessMessage("Listing updated successfully! Redirecting...");


      setTimeout(() => {
        setSuccessMessage(null);
        navigate("/listings");
      }, 5000);

    } catch (err) {
      setErrorMessage("❌ Failed to update listing.");
      console.error("Update Error:", err);

      setTimeout(() => setErrorMessage(null), 3000);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this listing?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "car", id));
      alert("Listing removed successfully!");
      navigate("/listings");
    } catch (err) {
      setErrorMessage("❌ Failed to delete listing.");
      console.error("Delete Error:", err);

      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  return (
    <>
      <Header />
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
              className="alert alert-success shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{successMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
              className="alert alert-error shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{errorMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="container mx-auto py-10 px-5">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Edit Listing</h1>
          <button className="btn btn-error" onClick={handleRemove}>Remove Listing</button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <ProgressSpinner />
          </div>
        ) : errorMessage ? (
          <p className="text-center text-red-500">{errorMessage}</p>
        ) : (
          <div className="max-w-lg mx-auto bg-white p-6 shadow-md rounded-lg mt-6">
            <form className="space-y-4" onSubmit={handleUpdate}>
              <div>
                <label className="label">Car Brand</label>
                <input type="text" name="brand" className="input input-bordered w-full" value={formData.brand} onChange={handleChange} required />
              </div>

              <div>
                <label className="label">Car Model</label>
                <input type="text" name="model" className="input input-bordered w-full" value={formData.model} onChange={handleChange} required />
              </div>

              <div>
                <label className="label">Car Year</label>
                <input type="number" name="year" className="input input-bordered w-full" value={formData.year} onChange={handleChange} required />
              </div>

              <div>
                <label className="label">Car Image</label>
                <input type="file" className="file-input file-input-bordered w-full" onChange={handleImageChange} />
                {formData.imageUrl && <img src={formData.imageUrl} alt="Car Preview" className="mt-2 w-40 h-40 object-cover rounded-lg" />}
              </div>

              <div>
                <label className="label">Capacity</label>
                <input type="number" name="capacity" className="input input-bordered w-full" value={formData.capacity} onChange={handleChange} required />
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


              <div>
                <label className="label">Price Per Hour (₹)</label>
                <input
                  type="number"
                  name="pricePerHour"
                  className="input input-bordered w-full"
                  value={formData.pricePerHour}
                  onChange={handleChange}
                  required
                />
              </div>


              <div>
                <label className="label">Location</label>
                <input type="text" name="location" className="input input-bordered w-full" value={formData.location} onChange={handleChange} required />
              </div>

              <div>
                <label className="label">Available From</label>
                <input type="datetime-local" name="availableFrom" className="input input-bordered w-full" value={formData.availableFrom} onChange={handleChange} required />
              </div>

              <div>
                <label className="label">Available Till</label>
                <input type="datetime-local" name="availableTill" className="input input-bordered w-full" value={formData.availableTill} onChange={handleChange} required />
              </div>

              <div className="text-center mt-4">
                <button type="submit" className="btn btn-primary w-full" disabled={uploading}>
                  {uploading ? "Updating..." : "Update Listing"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default EditListingPage;
