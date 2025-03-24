import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import Header from "../components/Header";
import { ProgressSpinner } from "primereact/progressspinner";

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
  const [filters, setFilters] = useState({
    fuelType: "",
    transmission: "",
    maxPrice: "Unlimited",
    brand: "",
  });

  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const searchLocation = params.get("location");
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
  }, []);

  const filteredListings = listings.filter((listing) => {
    return (
      (!filters.fuelType || listing.fuelType === filters.fuelType) &&
      (!filters.transmission || listing.transmission === filters.transmission) &&
      (!filters.brand || listing.brand === filters.brand) &&
      (filters.maxPrice === "Unlimited" || listing.pricePerHour <= filters.maxPrice)
    );
  });

  return (
    <>
      <Header />
      <div className="container mx-auto py-10 px-5 flex gap-6">
        {/* Left Pane - Filters */}
        <div className="w-1/4 bg-gray-200 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Filters</h2>

          <label className="block mb-2">Car Brand:</label>
          <select
            className="select select-info w-full mb-4"
            onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
          >
            <option value="">All Brands</option>
            <option value="Toyota">Toyota</option>
            <option value="Honda">Honda</option>
            <option value="Ford">Ford</option>
            <option value="BMW">BMW</option>
          </select>

          <label className="block mb-2">Max Price (₹/hour):</label>
          <input
            type="range"
            min={50}
            max={350}
            step={50}
            value={filters.maxPrice === "Unlimited" ? 350 : filters.maxPrice}
            className="range range-success"
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              setFilters({ ...filters, maxPrice: val === 350 ? "Unlimited" : val });
            }}
          />

          <label className="block mb-2">Fuel Type:</label>
          <div className="flex flex-col gap-2 mb-4">
            <label>
              <input type="radio" name="fuelType" className="radio radio-accent" onChange={() => setFilters({ ...filters, fuelType: "Petrol" })} /> Petrol
            </label>
            <label>
              <input type="radio" name="fuelType" className="radio radio-accent" onChange={() => setFilters({ ...filters, fuelType: "Diesel" })} /> Diesel
            </label>
            <label>
              <input type="radio" name="fuelType" className="radio radio-accent" onChange={() => setFilters({ ...filters, fuelType: "Electric" })} /> Electric
            </label>
          </div>

          <label className="block mb-2">Transmission:</label>
          <div className="flex flex-col gap-2">
            <label>
              <input type="radio" name="transmission" className="radio radio-accent" onChange={() => setFilters({ ...filters, transmission: "Manual" })} /> Manual
            </label>
            <label>
              <input type="radio" name="transmission" className="radio radio-accent" onChange={() => setFilters({ ...filters, transmission: "Automatic" })} /> Automatic
            </label>
          </div>
        </div>

        {/* Listings Section */}
        <div className="w-3/4">
          <h1 className="text-3xl font-bold mb-6">Available Cars in {searchLocation}</h1>

          {loading ? (
            <div className="flex justify-center items-center min-h-[200px] bg-transparent">
              <ProgressSpinner style={{ width: "50px", height: "50px" }} strokeWidth="8" animationDuration=".5s" />
            </div>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : filteredListings.length === 0 ? (
            <p className="text-center text-lg">No cars available matching filters.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((listing) => (
                <div key={listing.id} className="card bg-base-100 shadow-lg p-4">
                  <img
                    src={listing.imageUrl || "https://via.placeholder.com/300x200"}
                    alt={`${listing.brand} ${listing.model}`}
                    className="w-full h-40 object-cover rounded-md mb-3"
                  />
                  <div className="card-body">
                    <h2 className="card-title">{listing.brand} {listing.model} ({listing.year})</h2>
                    <p className="text-sm text-gray-600">Fuel: {listing.fuelType}</p>
                    <p className="text-sm text-gray-600">Transmission: {listing.transmission}</p>
                    <p className="text-sm text-gray-600">Seats: {listing.capacity}</p>
                    <p className="text-sm text-gray-600">Location: {listing.location}</p>
                    <p className="text-sm text-green-500 font-semibold">Price per Hour: ₹{listing.pricePerHour}</p>
                    <p className="text-sm">Available From: {formatDate(listing.availableFrom)}</p>
                    <p className="text-sm">Available Till: {formatDate(listing.availableTill)}</p>
                    
                    <div className="mt-3 flex flex-col gap-2">
                      <button className="btn btn-outline btn-primary w-full" onClick={() => navigate(`/listing/${listing.id}`)}>View Details</button>
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
  