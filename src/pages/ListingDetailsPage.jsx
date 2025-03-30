import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import Header from "../components/Header";
import { FaCar, FaCalendarAlt, FaGasPump, FaUsers, FaCogs, FaMapMarkerAlt, FaUserShield, FaUser, FaMoneyBillWave, FaCheckCircle } from "react-icons/fa";
import { Card } from "primereact/card";
import { Image } from "primereact/image";
import { Tooltip } from "primereact/tooltip";
import { ProgressSpinner } from "primereact/progressspinner";

const priceOptions = {
  "Per Hour": 1,
  "Per Day": 24,
  "Per Week": 24 * 7,
  "Per Month": 24 * 30,
};

const ListingDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate(); 
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState("Per Day");
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [seller, setSeller] = useState("Unknown Seller");

  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "car", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const carData = { id: docSnap.id, ...docSnap.data() };
          setListing(carData);
          
          // Fetch seller info
          const userRef = doc(db, "users", carData.ownerId);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const userData = userSnap.data();
            setSeller(userData.username || "Unknown Seller");
          }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-transparent">
        <ProgressSpinner />
      </div>
    );
  }

  const handleBookNow = () => {
    navigate(`/booking/${id}`);
  };

  if (!listing) return <p className="text-center text-lg text-red-500">Listing not found.</p>;

  const carAge = new Date().getFullYear() - listing.year;

  return (
    <>
      <Header />
      <div className="container mx-auto py-10 px-5 flex gap-6">
        <div className="w-2/3 space-y-6">
          <Card className="p-6 shadow-lg rounded-lg">
            <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
              <FaCar className="text-blue-600" /> {listing.brand} {listing.model} ({listing.year})
            </h1>

            <div className="space-y-3 text-lg">
              <p className="flex items-center gap-2">
                <FaCalendarAlt className="text-gray-600" /> Car Age: <span className="font-semibold">{carAge} years</span>
              </p>
              <p className="flex items-center gap-2">
                <FaGasPump className="text-gray-600" /> Fuel Type: <span className="font-semibold">{listing.fuelType}</span>
              </p>
              <p className="flex items-center gap-2">
                <FaUsers className="text-gray-600" /> Capacity: <span className="font-semibold">{listing.capacity} Seats</span>
              </p>
              <p className="flex items-center gap-2">
                <FaCogs className="text-gray-600" /> Transmission: <span className="font-semibold">{listing.transmission}</span>
              </p>
              <p className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-gray-600" /> Location: <span className="font-semibold">{listing.location}</span>
              </p>
            </div>
          </Card>

          <Card className="p-6 shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <FaMoneyBillWave className="text-green-600" /> Select Pricing
            </h2>

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

            <button className="btn btn-primary w-full" onClick={handleBookNow}>
              Book Now
            </button>
          </Card>
        </div>

        <div className="w-1/3">
          <Card className="p-4 shadow-lg rounded-lg">
            <Image src={listing.imageUrl} alt="Car" className="rounded-lg" preview />
          </Card>

          <Card className="p-6 shadow-lg rounded-lg mt-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <FaUserShield className="text-blue-600" /> Seller Details
            </h2>
            
            <p className="text-lg flex items-center gap-2">
              <FaUser className="text-gray-600" /> Owner Name: <span className="font-semibold">{seller}</span>
              <span data-pr-tooltip="Verified">
                <FaCheckCircle className="text-green-500 cursor-pointer" />
              </span>
            </p>

            <Tooltip target="[data-pr-tooltip]" />
          </Card> 
        </div>
      </div>
    </>
  );
};

export default ListingDetailsPage;
