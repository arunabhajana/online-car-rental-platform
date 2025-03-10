import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    return (
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
                <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" />

                {user ? (
                    <>
                        {/* Show New Listing button only if the user is logged in */}
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
                        {/* Show Login & Sign Up buttons if the user is NOT logged in */}
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
    );
};

export default Header;
