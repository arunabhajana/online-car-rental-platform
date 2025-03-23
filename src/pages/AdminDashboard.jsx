import { useState, useEffect } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { Link } from "react-router-dom";
import { db, auth } from "../firebaseConfig";
import { FiUsers, FiBarChart2, FiLogOut } from "react-icons/fi";
import { FaCar } from "react-icons/fa";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [username, setUsername] = useState("");

    useEffect(() => {
        const checkAdminStatus = async () => {
            const user = auth.currentUser;
            if (!user) return;

            try {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setIsAdmin(userData.role === "admin");
                    setUsername(userData.displayName || userData.username || "Admin");
                }
            } catch (error) {
                console.error("Error checking admin status:", error);
            }
        };

        checkAdminStatus();
    }, []);

    useEffect(() => {
        if (!isAdmin) return;

        const fetchUsers = async () => {
            try {
                const usersCollection = collection(db, "users");
                const usersSnapshot = await getDocs(usersCollection);
                setUsers(usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        const fetchCars = async () => {
            try {
                const carsCollection = collection(db, "car");
                const carsSnapshot = await getDocs(carsCollection);
                setCars(carsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            } catch (error) {
                console.error("Error fetching cars:", error);
            }
        };

        Promise.all([fetchUsers(), fetchCars()]).then(() => setLoading(false));
    }, [isAdmin]);

    const handleLogout = async () => {
        await signOut(auth);
        window.location.href = "/login";
    };

    if (!isAdmin) {
        return <div className="flex justify-center items-center h-screen text-red-600 text-xl">Access Denied</div>;
    }

    if (loading) {
        return <div className="flex justify-center items-center h-screen text-blue-600 text-xl">Loading...</div>;
    }

    const userRegistrations = users
        .map(user => user.createdDate?.seconds * 1000)
        .filter(Boolean)
        .sort((a, b) => a - b);

    const formattedDates = userRegistrations.map(ts => new Date(ts).toLocaleDateString());
    const dateCounts = formattedDates.reduce((acc, date) => {
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {});

    const chartData = Object.keys(dateCounts).map(date => ({
        date,
        registrations: dateCounts[date],
    }));

    return (
        <div className="flex">
            <div className="w-52 bg-gray-900 text-white flex flex-col h-screen fixed top-0 left-0 p-4">
                <h2 className="text-2xl font-bold">Admin Panel</h2>
                <nav className="flex-grow space-y-2 mt-4">
                    <Link to="/admin" className="py-2 px-4 rounded bg-gray-700 flex items-center gap-2">
                        <FiBarChart2 /> Dashboard
                    </Link>
                    <Link to="/admin/users" className="py-2 px-4 rounded hover:bg-gray-700 flex items-center gap-2">
                        <FiUsers /> Users
                    </Link>
                    <Link to="/admin/listings" className="py-2 px-4 rounded hover:bg-gray-700 flex items-center gap-2">
                        <FaCar /> Listings
                    </Link>
                </nav>
                <button
                    onClick={handleLogout}
                    className="btn btn-error text-white flex items-center justify-center gap-2 mt-auto"
                >
                    <FiLogOut /> Logout
                </button>
            </div>

            <div className="flex-1 p-6 bg-gray-100 pl-64">
                <h1 className="text-3xl font-bold text-center mb-6">Welcome, {username}</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-blue-500 text-white p-6 rounded-lg shadow flex items-center gap-4">
                        <FiUsers className="text-3xl" />
                        <div>
                            <h2 className="text-lg">Total Users</h2>
                            <p className="text-2xl font-bold">{users.length}</p>
                        </div>
                    </div>
                    <div className="bg-green-500 text-white p-6 rounded-lg shadow flex items-center gap-4">
                        <FaCar className="text-3xl" />
                        <div>
                            <h2 className="text-lg">Total Listings</h2>
                            <p className="text-2xl font-bold">{cars.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow mb-6">
                    <h2 className="text-xl font-semibold mb-4">User Registrations Over Time</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="registrations" fill="#3498db" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="pb-16">
                    <h2 className="text-xl font-semibold mb-2">Recent Users</h2>
                    <div className="overflow-x-auto">
                        <table className="table w-full border border-gray-200">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="p-2">User ID</th>
                                    <th className="p-2">Email</th>
                                    <th className="p-2">Username</th>
                                    <th className="p-2">Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.slice(-5).reverse().map(user => (
                                    <tr key={user.id} className="border-t">
                                        <td className="p-2">{user.id}</td>
                                        <td className="p-2">{user.email}</td>
                                        <td className="p-2">{user.username || "N/A"}</td>
                                        <td className="p-2">{user.role}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <h2 className="text-xl font-semibold mt-6 mb-2">Recent Listings</h2>
                <div className="overflow-x-auto">
                    <table className="table w-full border border-gray-200">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="p-2">Listing ID</th>
                                <th className="p-2">Brand</th>
                                <th className="p-2">Model</th>
                                <th className="p-2">Price per Hour</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cars.slice(-5).reverse().map(car => (
                                <tr key={car.id} className="border-t">
                                    <td className="p-2">{car.id}</td>
                                    <td className="p-2">{car.brand}</td>
                                    <td className="p-2">{car.model}</td>
                                    <td className="p-2">${car.pricePerHour}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
