import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import Header from "../components/Header";
import { FaCar, FaCalendarAlt, FaGasPump, FaUsers, FaCogs, FaMapMarkerAlt, FaClock } from "react-icons/fa";

// Pricing multipliers
const priceOptions = {
  "Per Hour": 1,
  "Per Day": 24,
  "Per Week": 24 * 7,
  "Per Month": 24 * 30,
};

const ListingDetailsPage = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState("Per Hour");
  const [calculatedPrice, setCalculatedPrice] = useState(0);

  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "car", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setListing({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching listing:", error);
      }
      setLoading(false);
    };

    fetchListing();
  }, [id]);

  useEffect(() => {
    if (listing) {
      setCalculatedPrice(listing.pricePerHour * priceOptions[selectedOption]);
    }
  }, [selectedOption, listing]);

  if (loading) return <p className="text-center text-lg">Loading...</p>;
  if (!listing) return <p className="text-center text-lg text-red-500">Listing not found.</p>;

  // Calculate car age
  const carAge = new Date().getFullYear() - listing.year;

  // Format date
  const formatDate = (timestamp) => {
    if (!timestamp || !timestamp.toDate) return "N/A";
    return timestamp.toDate().toLocaleDateString();
  };

  return (
    <>
      <Header />
      <div className="container mx-auto py-10 px-5 flex gap-6">
        {/* Left Side - Car Details */}
        <div className="w-2/3 bg-white p-6 shadow-lg rounded-lg">
          <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
            <FaCar className="text-blue-600" /> {listing.brand} {listing.model} ({listing.year})
          </h1>

          <div className="space-y-3">
            <p className="text-lg flex items-center gap-2">
              <FaCalendarAlt className="text-gray-600" /> Car Age: <span className="font-semibold">{carAge} years</span>
            </p>
            <p className="text-lg flex items-center gap-2">
              <FaGasPump className="text-gray-600" /> Fuel Type: <span className="font-semibold">{listing.fuelType}</span>
            </p>
            <p className="text-lg flex items-center gap-2">
              <FaUsers className="text-gray-600" /> Capacity: <span className="font-semibold">{listing.capacity} Seats</span>
            </p>
            <p className="text-lg flex items-center gap-2">
              <FaCogs className="text-gray-600" /> Transmission: <span className="font-semibold">{listing.transmission}</span>
            </p>
            <p className="text-lg flex items-center gap-2">
              <FaMapMarkerAlt className="text-gray-600" /> Location: <span className="font-semibold">{listing.location}</span>
            </p>
            <p className="text-lg flex items-center gap-2">
              <FaClock className="text-gray-600" /> Availability:{" "}
              <span className="font-semibold">
                {formatDate(listing.availableFrom)} - {formatDate(listing.availableTill)}
              </span>
            </p>
          </div>
        </div>

        <div className="w-1/3 bg-gray-100 p-6 shadow-lg rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Select Pricing</h2>

          <select
            className="select select-bordered w-full mb-4"
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            {Object.keys(priceOptions).map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <p className="text-xl font-bold text-blue-600 mb-4">
            Total Price: ₹{calculatedPrice}
          </p>

          <button className="btn btn-primary w-full">Book Now</button>
        </div>
      </div>
    </>
  );
};

export default ListingDetailsPage;
