import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import Header from "../components/Header";
import { ProgressSpinner } from "primereact/progressspinner";
import { getAuth } from "firebase/auth";
import { FaStar } from "react-icons/fa";

// Function to format date
const formatDate = (timestamp) => {
  if (!timestamp || !timestamp.toDate) return "N/A";
  return timestamp.toDate().toLocaleString();
};

const SearchResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = getAuth();
  const currentUser = auth.currentUser;

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ratingsMap, setRatingsMap] = useState({});
  const [filters, setFilters] = useState({
    fuelType: "",
    transmission: "",
    maxPrice: "Unlimited",
    brand: "",
  });
  const [sortByRating, setSortByRating] = useState(false);
  const [sortByPrice, setSortByPrice] = useState(false); 

  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const searchLocation = params.get("location");
  const pickupDate = useMemo(() => new Date(params.get("pickupDate")), [params]);
  const dropoffDate = useMemo(() => new Date(params.get("dropoffDate")), [params]);

  // Fetch reviews and calculate average rating
  const fetchRatingsForListings = async (listingIds) => {
    const ratingsMap = {};

    try {
      const reviewsSnapshot = await getDocs(collection(db, "reviews"));

      listingIds.forEach(id => {
        ratingsMap[id] = { total: 0, count: 0 };
      });

      reviewsSnapshot.forEach(doc => {
        const data = doc.data();
        const carId = data.carId;

        if (ratingsMap[carId]) {
          ratingsMap[carId].total += data.rating;
          ratingsMap[carId].count += 1;
        }
      });

      const result = {};
      for (const carId in ratingsMap) {
        const { total, count } = ratingsMap[carId];
        result[carId] = {
          avg: count > 0 ? total / count : 0, 
          count,
        };
      }

      return result;
    } catch (err) {
      console.error("Error fetching ratings:", err);
      return {};
    }
  };

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

        const ids = filteredListings.map((l) => l.id);
        const ratings = await fetchRatingsForListings(ids);
        setRatingsMap(ratings);
      } catch (err) {
        console.error("Error fetching listings:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [searchLocation, pickupDate, dropoffDate]);

  const filteredListings = listings.filter((listing) => {
    return (
      (!filters.fuelType || listing.fuelType === filters.fuelType) &&
      (!filters.transmission || listing.transmission === filters.transmission) &&
      (!filters.brand || listing.brand === filters.brand) &&
      (filters.maxPrice === "Unlimited" || listing.pricePerHour <= filters.maxPrice)
    );
  });

  const clearFilters = () => {
    setFilters({
      fuelType: "",
      transmission: "",
      maxPrice: "Unlimited",
      brand: "",
    });
  };

  const sortedListings = useMemo(() => {
    let sorted = [...filteredListings];

    if (sortByRating) {
      sorted = sorted.sort((a, b) => {
        const ratingA = ratingsMap[a.id]?.avg || 0;
        const ratingB = ratingsMap[b.id]?.avg || 0;
        return ratingB - ratingA; 
      });
    } else if (sortByPrice) {
      sorted = sorted.sort((a, b) => a.pricePerHour - b.pricePerHour); 
    }

    return sorted;
  }, [filteredListings, ratingsMap, sortByRating, sortByPrice]);

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
            value={filters.brand}
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
          <p className="text-sm mb-4 mt-1">
            {filters.maxPrice === "Unlimited" ? "Unlimited" : `₹${filters.maxPrice}`}
          </p>

          <label className="block mb-2">Fuel Type:</label>
          <div className="flex flex-col gap-2 mb-4">
            {["Petrol", "Diesel", "Electric"].map((type) => (
              <label key={type}>
                <input
                  type="radio"
                  name="fuelType"
                  className="radio radio-accent"
                  checked={filters.fuelType === type}
                  onChange={() => setFilters({ ...filters, fuelType: type })}
                />{" "}
                {type}
              </label>
            ))}
          </div>

          <label className="block mb-2">Transmission:</label>
          <div className="flex flex-col gap-2 mb-4">
            {["Manual", "Automatic"].map((type) => (
              <label key={type}>
                <input
                  type="radio"
                  name="transmission"
                  className="radio radio-accent"
                  checked={filters.transmission === type}
                  onChange={() => setFilters({ ...filters, transmission: type })}
                />{" "}
                {type}
              </label>
            ))}
          </div>

          <button
            className="btn btn-warning w-full mt-2"
            onClick={clearFilters}
          >
            Clear Filters ✖
          </button>
        </div>

        {/* Listings Section */}
        <div className="w-3/4">
          <h1 className="text-3xl font-bold mb-6">
            Available Cars in {searchLocation}
          </h1>

          {/* Sorting Buttons */}
          <div className="flex gap-4 mb-4">
            <button
              className={`btn ${sortByRating ? "btn-info" : "btn-outline"}`}
              onClick={() => {
                setSortByRating(!sortByRating);
                setSortByPrice(false); 
              }}
            >
              {sortByRating ? "Sorting by Rating" : "Sort by Rating"}
            </button>

            <button
              className={`btn ${sortByPrice ? "btn-info" : "btn-outline"}`}
              onClick={() => {
                setSortByPrice(!sortByPrice);
                setSortByRating(false); 
              }}
            >
              {sortByPrice ? "Sorting by Price" : "Sort by Price"}
            </button>

            <button
              className="btn btn-warning"
              onClick={() => {
                setSortByRating(false);
                setSortByPrice(false); 
              }}
            >
              Clear Sort
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center min-h-[200px] bg-transparent">
              <ProgressSpinner style={{ width: "50px", height: "50px" }} strokeWidth="8" animationDuration=".5s" />
            </div>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : sortedListings.length === 0 ? (
            <p className="text-center text-lg">No cars available matching filters.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedListings.map((listing) => {
                const isOwner = currentUser && listing.ownerId === currentUser.uid;
                const rating = ratingsMap[listing.id];

                return (
                  <div key={listing.id} className="card bg-base-100 shadow-lg p-4">
                    <img
                      src={listing.imageUrl || "https://via.placeholder.com/300x200"}
                      alt={`${listing.brand} ${listing.model}`}
                      className="w-full h-40 object-cover rounded-md mb-3"
                    />
                    <div className="card-body">
                      <div className="flex justify-between items-center">
                        <h2 className="card-title">
                          {listing.brand} {listing.model} ({listing.year})
                        </h2>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={`${
                                rating && i < Math.floor(rating.avg)
                                  ? "text-yellow-400"
                                  : "text-gray-400"
                              }`}
                            />
                          ))}
                          <span className="ml-2 text-sm text-gray-600">({rating ? rating.count : 0})</span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600">Fuel: {listing.fuelType}</p>
                      <p className="text-sm text-gray-600">Transmission: {listing.transmission}</p>
                      <p className="text-sm text-gray-600">Seats: {listing.capacity}</p>
                      <p className="text-sm text-gray-600">Location: {listing.location}</p>
                      <p className="text-sm text-green-500 font-semibold">Price per Hour: ₹{listing.pricePerHour}</p>

                      <p className="text-sm">Available From: {formatDate(listing.availableFrom)}</p>
                      <p className="text-sm">Available Till: {formatDate(listing.availableTill)}</p>

                      <div className="mt-3 flex flex-col gap-2">
                        <button
                          className="btn btn-outline btn-primary w-full"
                          onClick={() => navigate(`/listing/${listing.id}`)}
                        >
                          View Details
                        </button>
                        {isOwner ? (
                          <button
                            className="btn btn-secondary w-full"
                            onClick={() => navigate(`/edit/${listing.id}`)}
                          >
                            Edit Details
                          </button>
                        ) : (
                          <button
                            className="btn btn-primary w-full"
                            onClick={() => navigate(`/booking/${listing.id}`)}
                          >
                            Book Now
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchResultsPage;
