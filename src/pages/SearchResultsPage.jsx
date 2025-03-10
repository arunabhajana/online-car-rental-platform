import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import Header from "../components/Header";

// Function to format date
const formatDate = (timestamp) => {
  if (!timestamp || !timestamp.toDate) return "N/A";
  return timestamp.toDate().toLocaleString();
};

const SearchResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memoize query parameters to prevent unnecessary re-renders
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const searchLocation = params.get("location");

  // Memoize pickup and dropoff dates
  const pickupDate = useMemo(() => new Date(params.get("pickupDate")), [params]);
  const dropoffDate = useMemo(() => new Date(params.get("dropoffDate")), [params]);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      setError(null);

      try {
        const listingsRef = collection(db, "car");
        const q = query(listingsRef, where("location", "==", searchLocation));
        const snapshot = await getDocs(q);

        const filteredListings = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((listing) => {
            const availableFrom = listing.availableFrom?.toDate();
            const availableTill = listing.availableTill?.toDate();
            return availableFrom <= pickupDate && availableTill >= dropoffDate;
          });

        setListings(filteredListings);
      } catch (err) {
        console.error("Error fetching listings:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []); // ✅ Runs only once when the component mounts

  return (
    <>
      <Header />
      <div className="container mx-auto py-10 px-5 flex gap-6">
        {/* Left Pane */}
        <div className="w-1/4 bg-gray-200 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Filters</h2>
          <p className="text-sm">More filtering options can be added here.</p>
        </div>

        {/* Listings Section */}
        <div className="w-3/4">
          <h1 className="text-3xl font-bold mb-6">Available Cars in {searchLocation}</h1>

          {loading ? (
            <p className="text-center text-lg">Loading listings...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : listings.length === 0 ? (
            <p className="text-center text-lg">No cars available for the selected dates.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <div key={listing.id} className="card bg-base-100 shadow-lg p-4">
                  <div className="card-body">
                    <h2 className="card-title">
                      {listing.brand} {listing.model} ({listing.year})
                    </h2>
                    <p className="text-sm text-gray-600">Fuel: {listing.fuelType}</p>
                    <p className="text-sm text-gray-600">Transmission: {listing.transmission}</p>
                    <p className="text-sm text-gray-600">Seats: {listing.capacity}</p>
                    <p className="text-sm text-gray-600">Location: {listing.location}</p>
                    <p className="text-sm text-green-500 font-semibold">
                      Price per Hour: ₹{listing.pricePerHour}
                    </p>
                    <p className="text-sm">Available From: {formatDate(listing.availableFrom)}</p>
                    <p className="text-sm">Available Till: {formatDate(listing.availableTill)}</p>
                    
                    <div className="mt-3 flex flex-col gap-2">
                      <button 
                        className="btn btn-outline btn-primary w-full"
                        onClick={() => navigate(`/listing/${listing.id}`)}
                      >
                        View Details
                      </button>
                      <button className="btn btn-primary w-full">Book Now</button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchResultsPage;
