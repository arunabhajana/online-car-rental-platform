import { useEffect, useState, useRef } from "react";
import { db, auth, storage } from "../firebaseConfig";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";
import {
  MapPin,
  Pencil,
  Star,
  CarFront,
  History,
  Camera,
  Check,
} from "lucide-react";
import Header from "../components/Header";

export default function UserProfile() {
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState("");
  const [profile, setProfile] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    description: "",
    location: "",
  });
  const [imageUrl, setImageUrl] = useState("profile.gif");
  const [totalListings, setTotalListings] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [pastBookings, setPastBookings] = useState([]);
  const [pastListings, setPastListings] = useState([]);

  const fileInputRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        await fetchUserData(user.uid);
        await fetchPastListings(user.uid);
        await fetchStats(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      const profileDoc = await getDoc(doc(db, "profile", uid));

      if (userDoc.exists()) {
        setUsername(userDoc.data().username || "");
        setFormData((prev) => ({ ...prev, username: userDoc.data().username || "" }));
      }

      if (profileDoc.exists()) {
        const data = profileDoc.data();
        setProfile(data);
        setImageUrl(data.photoURL || "profile.gif");
        setFormData((prev) => ({
          ...prev,
          description: data.description || "",
          location: data.location || "",
        }));
      }
    } catch (error) {
      console.error("Failed to fetch user/profile:", error);
    }
  };

  const fetchPastListings = async (uid) => {
    try {
      const listingsRef = collection(db, "car");
      const q = query(
        listingsRef,
        where("ownerId", "==", uid),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      const listingsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPastListings(listingsData);
    } catch (error) {
      console.error("Error fetching listings:", error);
    }
  };

  const fetchStats = async (uid) => {
    try {
      const listingsSnap = await getDocs(query(collection(db, "car"), where("ownerId", "==", uid)));
      setTotalListings(listingsSnap.size);

      const bookingsSnap = await getDocs(
        query(collection(db, "bookings"), where("userId", "==", uid), orderBy("createdAt", "desc"))
      );
      setTotalBookings(bookingsSnap.docs.length);

      const bookingsData = bookingsSnap.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          pickupDate: data.bookingDetails?.pickupDate || "",
          dropoffDate: data.bookingDetails?.dropoffDate || "",
          pickupLocation: data.bookingDetails?.pickupLocation || "",
          dropoffLocation: data.bookingDetails?.dropoffLocation || "",
          fullName: data.fullName || "",
          vehicle: data.vehicle || {},
          createdAt: data.createdAt,
        };
      });

      setPastBookings(bookingsData);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return;

    await setDoc(
      doc(db, "users", userId),
      { username: formData.username },
      { merge: true }
    );

    await setDoc(
      doc(db, "profile", userId),
      {
        description: formData.description,
        location: formData.location,
        userId,
        photoURL: imageUrl,
      },
      { merge: true }
    );

    setUsername(formData.username);
    setProfile((prev) => ({
      ...prev,
      description: formData.description,
      location: formData.location,
      photoURL: imageUrl,
    }));
    setIsModalOpen(false);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !userId) return;

    const storageRef = ref(storage, `avatars/${userId}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    setImageUrl(downloadURL);

    await setDoc(
      doc(db, "profile", userId),
      { photoURL: downloadURL },
      { merge: true }
    );
  };

  return (
    <div className="min-h-screen bg-base-200">
      <Header />

      <div className="relative h-48 bg-gradient-to-r from-blue-100 to-green-100">
        <div className="absolute left-6 bottom-[-3rem] group">
          <div className="avatar w-32 h-32 relative">
            <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden relative">
              <img src={imageUrl} alt="User Avatar" className="object-cover w-full h-full" />
              <div
                className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity duration-200"
                onClick={() => fileInputRef.current.click()}
              >
                <Camera className="text-white" size={24} />
              </div>
            </div>
          </div>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
        </div>
      </div>

      <div className="px-6 mt-8 mb-10 flex flex-col lg:flex-row justify-between max-w-6xl mx-auto gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold">{username}</h2>
            <div
              className={`tooltip tooltip-bottom ${profile.verified ? "text-green-500" : "text-gray-400"}`}
              data-tip={profile.verified ? "Verified" : "Not Verified"}
            >
              <Check size={20} />
            </div>
          </div>
          {profile.description && <p className="text-sm text-gray-500">{profile.description}</p>}
          {profile.location && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin size={16} />
              <span>{profile.location}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl shadow flex flex-col items-center justify-center">
            <Star className="text-yellow-500 mb-1" />
            <p className="text-sm font-medium">Rating</p>
            <p className="text-lg font-bold">4.8</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow flex flex-col items-center justify-center">
            <CarFront className="text-blue-500 mb-1" />
            <p className="text-sm font-medium">Total Listings</p>
            <p className="text-lg font-bold">{totalListings}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow flex flex-col items-center justify-center">
            <History className="text-green-500 mb-1" />
            <p className="text-sm font-medium">Total Bookings</p>
            <p className="text-lg font-bold">{totalBookings}</p>
          </div>
          <button
            className="col-span-2 md:col-span-3 btn btn-outline btn-primary mt-2"
            onClick={() => setIsModalOpen(true)}
          >
            <Pencil className="mr-2" size={18} />
            Edit Profile
          </button>
        </div>
      </div>

      {isModalOpen && (
        <dialog open className="modal modal-bottom sm:modal-middle">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Edit Profile</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label text-sm font-semibold">Username</label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
              <div>
                <label className="label text-sm font-semibold">Description</label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div>
                <label className="label text-sm font-semibold">Location</label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
              <div className="modal-action">
                <button type="submit" className="btn btn-primary">Save</button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn">Cancel</button>
              </div>
            </form>
          </div>
        </dialog>
      )}

      <div className="px-6 pb-10 max-w-6xl mx-auto space-y-8">
        <section>
          <h3 className="text-xl font-semibold mb-4">Past Bookings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pastBookings.length > 0 ? (
              pastBookings.map((booking, idx) => (
                <div key={idx} className="card bg-white shadow-md p-4 rounded-xl">
                  <div className="flex items-center gap-4">
                    <img
                      src={booking.vehicle?.imageUrl}
                      alt={booking.vehicle?.model}
                      className="w-28 h-20 object-cover rounded-lg"
                    />
                    <div>
                      <h4 className="text-lg font-bold">
                        {booking.vehicle?.brand} {booking.vehicle?.model} ({booking.vehicle?.year})
                      </h4>
                      <p className="text-sm text-gray-500">
                        {booking.pickupDate} - {booking.dropoffDate}
                      </p>
                      <p className="text-sm">Pickup: {booking.pickupLocation}</p>
                      <p className="text-sm">Drop: {booking.dropoffLocation}</p>

                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No past bookings.</p>
            )}
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-4">Past Listings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pastListings.length > 0 ? (
              pastListings.map((listing, idx) => (
                <div key={idx} className="card bg-white shadow-md p-4 rounded-xl">
                  <h4 className="text-lg font-bold">
                    {listing.brand} {listing.model} ({listing.year})
                  </h4>
                  <p className="text-sm text-gray-500">
                    Listed on:{" "}
                    {listing.createdAt?.seconds
                      ? new Date(listing.createdAt.seconds * 1000).toDateString()
                      : "N/A"}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No past listings.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}