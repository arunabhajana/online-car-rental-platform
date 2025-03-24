import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebaseConfig";
import Header from "../components/Header";

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
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

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
  const handleUpdate = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError(null);

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

      alert("Listing updated successfully!");
      navigate("/listings");
    } catch (err) {
      setError("Failed to update listing.");
      console.error("Update Error:", err);
    } finally {
      setUploading(false);
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
