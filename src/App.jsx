import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth, db } from "./firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import ListingsPage from "./pages/ListingsPage";
import NewListingsPage from "./pages/NewListingsPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";
import EditListingPage from "./pages/EditListingsPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import ListingDetailsPage from "./pages/ListingDetailsPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminListings from "./pages/AdminListings";
import BookingPage from "./pages/BookingsPage";
import UserProfile from "./pages/ProfilePage";

function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setRole(userDoc.data().role);
        } else {
          setRole("user"); 
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <NavigateBasedOnRole role={role} /> : <LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />

        <Route path="/home" element={<PrivateRoute role={role}><HomePage /></PrivateRoute>} />
        <Route path="/listings" element={<PrivateRoute role={role}><ListingsPage /></PrivateRoute>} />
        <Route path="/new-listing" element={<PrivateRoute role={role}><NewListingsPage /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute role={role}><UserProfile /></PrivateRoute>} />
        <Route path="/edit/:id" element={<PrivateRoute role={role}><EditListingPage /></PrivateRoute>} />
        <Route path="/search-results" element={<PrivateRoute role={role}><SearchResultsPage /></PrivateRoute>} />
        <Route path="/listing/:id" element={<PrivateRoute role={role}><ListingDetailsPage /></PrivateRoute>} />
        <Route path="/booking/:id" element={<PrivateRoute role={role}><BookingPage /></PrivateRoute>} />

        {/* Admin Routes */}
        <Route path="/admin-dashboard" element={<AdminRoute role={role}><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute role={role}><AdminUsers /></AdminRoute>} />
        <Route path="/admin/listings" element={<AdminRoute role={role}><AdminListings /></AdminRoute>} />
      </Routes>
    </Router>
  );
}

const NavigateBasedOnRole = ({ role }) => {
  return role === "admin" ? <Navigate to="/admin-dashboard" /> : <Navigate to="/home" />;
};

const PrivateRoute = ({ role, children }) => {
  return role ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ role, children }) => {
  return role === "admin" ? children : <Navigate to="/home" />;
};

export default App;
