import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { Link } from "react-router-dom";
import { db, auth } from "../firebaseConfig";
import { FiUsers, FiBarChart2, FiLogOut, FiCalendar } from "react-icons/fi";
import { FaCar } from "react-icons/fa";

const AdminBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const bookingsCollection = collection(db, "bookings");
                const bookingsSnapshot = await getDocs(bookingsCollection);
                setBookings(bookingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                setLoading(false);
            } catch (error) {
                console.error("Error fetching bookings:", error);
            }
        };

        fetchBookings();
    }, []);

    const handleLogout = async () => {
        await signOut(auth);
        window.location.href = "/login";
    };

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className="w-64 bg-gray-900 text-white flex flex-col h-screen p-4">
                <h2 className="text-2xl font-bold">Admin Panel</h2>
                <nav className="flex-grow space-y-2 mt-4">
                    <Link to="/admin-dashboard" className="py-2 px-4 rounded hover:bg-gray-700 flex items-center gap-2">
                        <FiBarChart2 /> Dashboard
                    </Link>
                    <Link to="/admin/users" className="py-2 px-4 rounded hover:bg-gray-700 flex items-center gap-2">
                        <FiUsers /> Users
                    </Link>
                    <Link to="/admin/listings" className="py-2 px-4 rounded hover:bg-gray-700 flex items-center gap-2">
                        <FaCar /> Listings
                    </Link>
                    <Link to="/admin/bookings" className="py-2 px-4 rounded bg-gray-700 flex items-center gap-2">
                        <FiCalendar /> Bookings
                    </Link>
                </nav>
                <button
                    onClick={handleLogout}
                    className="btn btn-error text-white flex items-center justify-center gap-2 mt-auto"
                >
                    <FiLogOut /> Logout
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 bg-gray-100 overflow-auto">
                <h1 className="text-3xl font-bold text-center mb-6">All Bookings</h1>

                {loading ? (
                    <div className="flex justify-center items-center h-64 text-blue-600 text-xl">Loading...</div>
                ) : (
                    <div className="overflow-x-auto rounded-box border border-base-content/5 bg-white p-4 shadow">
                        <table className="table w-full text-sm">
                            <thead>
                                <tr className="bg-gray-200 text-left">
                                    <th className="p-2">Booking ID</th>
                                    <th className="p-2">Full Name</th>
                                    <th className="p-2">Email</th>
                                    <th className="p-2">Mobile</th>
                                    <th className="p-2">Pickup</th>
                                    <th className="p-2">Dropoff</th>
                                    <th className="p-2">Vehicle</th>
                                    <th className="p-2">Payment</th>
                                    <th className="p-2">Created At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map(booking => (
                                    <tr key={booking.id} className="border-t">
                                        <td className="p-2">{booking.id}</td>
                                        <td className="p-2">{booking.fullName}</td>
                                        <td className="p-2">{booking.email}</td>
                                        <td className="p-2">{booking.mobileNumber}</td>
                                        <td className="p-2">
                                            <div>
                                                <div className="font-medium">{booking.bookingDetails?.pickupLocation}</div>
                                                <div>{booking.bookingDetails?.pickupDate} at {booking.bookingDetails?.pickupTime}</div>
                                            </div>
                                        </td>
                                        <td className="p-2">
                                            <div>
                                                <div className="font-medium">{booking.bookingDetails?.dropoffLocation}</div>
                                                <div>{booking.bookingDetails?.dropoffDate} at {booking.bookingDetails?.dropoffTime}</div>
                                            </div>
                                        </td>
                                        <td className="p-2">
                                            <div>
                                                <div className="font-semibold">{booking.vehicle?.brand} {booking.vehicle?.model}</div>
                                                <div className="text-xs text-gray-500">Year: {booking.vehicle?.year}</div>
                                            </div>
                                        </td>
                                        <td className="p-2">
                                            ₹{booking.payment?.amount} <br />
                                            <span className="text-xs text-gray-500">ID: {booking.payment?.paymentIntentId}</span>
                                        </td>
                                        <td className="p-2">{new Date(booking.createdAt?.seconds * 1000).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminBookings;
