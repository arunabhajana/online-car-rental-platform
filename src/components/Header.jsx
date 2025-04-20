import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMac, setIsMac] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const searchRef = useRef(null);

  const cityList = [
    "Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata",
    "Pune", "Hyderabad", "Ahmedabad", "Jaipur", "Surat",
    "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane"
  ];

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().includes("MAC"));
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((isMac && event.metaKey && event.key === "k") || (!isMac && event.ctrlKey && event.key === "k")) {
        event.preventDefault();
        setIsSearchOpen(true);
        setTimeout(() => searchRef.current?.focus(), 100);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMac]);

  useEffect(() => {
    const fetchProfileImage = async () => {
      if (user?.uid) {
        const profileRef = doc(db, "profile", user.uid);
        const profileSnap = await getDoc(profileRef);
        if (profileSnap.exists()) {
          const data = profileSnap.data();
          setProfileImage(data.photoURL || user.photoURL);
        } else {
          setProfileImage(user.photoURL);
        }
      }
    };
    fetchProfileImage();
  }, [user]);

  const formatInput = (input) => {
    const parts = input.trim().split(/\s+/);
    const lastPart = parts[parts.length - 1];
    let days = 2;

    if (!isNaN(lastPart)) {
      days = parseInt(lastPart, 10);
      parts.pop();
    }

    const city = parts.join(" ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
    return { city, days };
  };

  const handleSearch = () => {
    const { city, days } = formatInput(searchTerm);
    const matchedCity = cityList.find((c) => c.toLowerCase() === city.toLowerCase());

    if (!matchedCity) {
      alert("Please enter a valid city from the list.");
      return;
    }

    const today = new Date();
    const pickupDate = today.toISOString().split("T")[0];
    const dropoffDate = new Date(today.setDate(today.getDate() + days))
      .toISOString()
      .split("T")[0];

    navigate(`/search-results?location=${matchedCity}&pickupDate=${pickupDate}&dropoffDate=${dropoffDate}`);
    setIsSearchOpen(false);
  };

  const handleInputChange = (value) => {
    setSearchTerm(value);

    const { city } = formatInput(value);
    if (city) {
      const filtered = cityList
        .filter((c) => c.toLowerCase().startsWith(city.toLowerCase()))
        .map((c) => {
          const days = formatInput(value).days;
          return `${c} (${days} day${days > 1 ? "s" : ""})`;
        });
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setSuggestions([]);
  };

  const renderSearchInput = () => (
    <div className="relative">
      <label className="input w-full">
        <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </g>
        </svg>
        <input
          type="search"
          ref={searchRef}
          className="grow"
          placeholder="Search by city and days (e.g., Hyderabad 3)"
          value={searchTerm}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
        />
        <kbd className="kbd kbd-sm">{isMac ? "⌘" : "Ctrl"}</kbd>
        <kbd className="kbd kbd-sm">K</kbd>
      </label>

      {suggestions.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full bg-white shadow rounded max-h-60 overflow-auto">
          {suggestions.map((s, i) => (
            <li
              key={i}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSuggestionClick(s)}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <>
      <div className="navbar bg-base-100 shadow-sm">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow">
              <li><a onClick={() => navigate("/")}>Home</a></li>
              <li><a onClick={() => navigate("/listings")}>Listings</a></li>
            </ul>
          </div>
        </div>

        <div className="navbar-center">
          <a onClick={() => navigate("/")} className="btn btn-ghost text-xl cursor-pointer">BookCars</a>
        </div>

        <div className="navbar-end flex gap-4">
          <div className="hidden md:block w-80">{renderSearchInput()}</div>

          <div className="block md:hidden">
            <button className="btn btn-ghost btn-circle" onClick={() => setIsSearchOpen(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>

          {user ? (
            <>
              <button className="btn btn-soft btn-primary" onClick={() => navigate("/new-listing")}>
                New Listing
              </button>
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full">
                    <img src={profileImage || "https://via.placeholder.com/40"} alt="User Avatar" />
                  </div>
                </div>
                <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow">
                  <li><a onClick={() => navigate("/profile")}>Profile</a></li>
                  <li><a onClick={logout}>Logout</a></li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <button className="btn btn-outline btn-primary" onClick={() => navigate("/login")}>
                Login
              </button>
              <button className="btn btn-primary" onClick={() => navigate("/register")}>
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>

      {isSearchOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-40 backdrop-blur-lg z-50">
          <div className="bg-white p-6 rounded-lg w-4/5 max-w-md shadow-lg">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Search</h2>
              <button className="text-gray-600" onClick={() => setIsSearchOpen(false)}>✖</button>
            </div>
            <div className="mt-4">{renderSearchInput()}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
