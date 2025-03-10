import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMac, setIsMac] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);

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

  return (
    <>
      <div className="navbar bg-base-100 shadow-sm">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow">
              <li><a onClick={() => navigate("/")}>Home</a></li>
              <li><a onClick={() => navigate("/suppliers")}>Suppliers</a></li>
              <li><a onClick={() => navigate("/listings")}>Listings</a></li>
            </ul>
          </div>
        </div>

        <div className="navbar-center">
          <a onClick={() => navigate("/")} className="btn btn-ghost text-xl cursor-pointer">BookCars</a>
        </div>

        <div className="navbar-end flex gap-4">
          <div className="hidden md:block">
            <label className="input">
              <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </g>
              </svg>
              <input type="search" className="grow" placeholder="Search" ref={searchRef} />
              <kbd className="kbd kbd-sm">{isMac ? "⌘" : "Ctrl"}</kbd>
              <kbd className="kbd kbd-sm">K</kbd>
            </label>
          </div>

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
                    <img src={user.photoURL || "https://via.placeholder.com/40"} alt="User Avatar" />
                  </div>
                </div>
                <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow">
                  <li><a onClick={() => navigate("/profile")}>Profile</a></li>
                  <li><a onClick={() => navigate("/settings")}>Settings</a></li>
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

      {/* ✅ Centered Search Modal with Background Blur */}
      {isSearchOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-40 backdrop-blur-lg z-50">
          <div className="bg-white p-6 rounded-lg w-4/5 max-w-md shadow-lg transform transition-all scale-95 animate-fadeIn">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Search</h2>
              <button className="text-gray-600" onClick={() => setIsSearchOpen(false)}>✖</button>
            </div>
            <div className="mt-4">
              <label className="input w-full">
                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.3-4.3"></path>
                  </g>
                </svg>
                <input type="search" className="grow" placeholder="Search..." ref={searchRef} />
                <kbd className="kbd kbd-sm">{isMac ? "⌘" : "Ctrl"}</kbd>
                <kbd className="kbd kbd-sm">K</kbd>
              </label>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
