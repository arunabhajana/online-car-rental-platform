import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { Link } from "react-router-dom";
import { db, auth } from "../firebaseConfig";
import { FiUsers, FiBarChart2, FiLogOut } from "react-icons/fi";
import { FaCar } from "react-icons/fa";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersCollection = collection(db, "users");
                const usersSnapshot = await getDocs(usersCollection);
                setUsers(usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                setLoading(false);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);

    const handleLogout = async () => {
        await signOut(auth);
        window.location.href = "/login";
    };

    return (
        <div className="flex h-screen">
            <div className="w-64 bg-gray-900 text-white flex flex-col h-screen p-4">
                <h2 className="text-2xl font-bold">Admin Panel</h2>
                <nav className="flex-grow space-y-2 mt-4">
                    <Link to="/admin-dashboard" className="py-2 px-4 rounded hover:bg-gray-700 flex items-center gap-2">
                        <FiBarChart2 /> Dashboard
                    </Link>
                    <Link to="/admin/users" className="py-2 px-4 rounded bg-gray-700 flex items-center gap-2">
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

            <div className="flex-1 p-6 bg-gray-100">
                <h1 className="text-3xl font-bold text-center mb-6">User Management</h1>

                {loading ? (
                    <div className="flex justify-center items-center h-64 text-blue-600 text-xl">Loading...</div>
                ) : (
                    <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 p-4">
                        <table className="table w-full">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="p-2">User ID</th>
                                    <th className="p-2">Email</th>
                                    <th className="p-2">Username</th>
                                    <th className="p-2">Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
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
                )}
            </div>
        </div>
    );
};

export default AdminUsers;
