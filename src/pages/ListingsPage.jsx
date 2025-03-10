import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import Header from "../components/Header";

// Function to format date-time
const formatDate = (timestamp) => {
  if (!timestamp || !timestamp.toDate) return "N/A";
  return timestamp.toDate().toLocaleString(); // Convert Firestore timestamp to readable format
};

const ListingsPage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // ✅ Initialize navigate

  useEffect(() => {
    if (!auth.currentUser) {
      setError("User not authenticated!");
      setLoading(false);
      return;
    }

    const listingsRef = collection(db, "car");
    const q = query(listingsRef, where("ownerId", "==", auth.currentUser.uid));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedListings = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setListings(fetchedListings);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching listings:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <>
      <Header />
      <div className="container mx-auto py-10 px-5">
        <h1 className="text-3xl font-bold text-center mb-8">My Listings</h1>

        {loading ? (
          <p className="text-center text-lg">Loading listings...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : listings.length === 0 ? (
          <p className="text-center text-lg">No listings found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>
                    <label>
                      <input type="checkbox" className="checkbox" />
                    </label>
                  </th>
                  <th>Serial No</th>
                  <th>Car</th>
                  <th>Fuel Type</th>
                  <th>Transmission</th>
                  <th>Location</th>
                  <th className="text-center">Availability</th>
                  <th>Price Per Hour (₹)</th> {/* ✅ New column for price per hour */}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((listing, index) => (
                  <tr key={listing.id}>
                    <th>
                      <label>
                        <input type="checkbox" className="checkbox" />
                      </label>
                    </th>
                    <td>{index + 1}</td>
                    <td>
                      <div>
                        <div className="font-bold">{listing.brand}</div>
                        <div className="text-sm opacity-70">
                          {listing.model} - {listing.year}
                        </div>
                      </div>
                    </td>
                    <td>{listing.fuelType}</td>
                    <td>{listing.transmission}</td>
                    <td>{listing.location}</td>
                    <td className="text-center">
                      {formatDate(listing.availableFrom)} → {formatDate(listing.availableTill)}
                    </td>
                    <td className="text-center font-semibold">₹{listing.pricePerHour || "N/A"}</td> {/* ✅ Display price per hour */}
                    <td>
                      <div className="flex space-x-2">
                        <button
                          className="btn btn-soft btn-info"
                          onClick={() => navigate(`/edit/${listing.id}`)} // ✅ Navigate to edit page
                        >
                          Edit
                        </button>
                        <button 
                          className="btn btn-soft btn-primary" 
                          onClick={() => alert("View Listing clicked!")} // Placeholder action
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default ListingsPage;
