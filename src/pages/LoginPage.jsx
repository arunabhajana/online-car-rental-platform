import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import Header from "../components/Header";
import { loginWithEmail, loginWithGoogle, db } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (user) => {
    try {
      const userRef = doc(db, "users", user.uid);
      let userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        const newUser = {
          uid: user.uid,
          email: user.email,
          username: user.displayName || "Anonymous",
          role: "user", 
          createdDate: serverTimestamp(), 
        };
        await setDoc(userRef, newUser);
        userDoc = await getDoc(userRef); 
      }

      const role = userDoc.data().role;
      console.log("User role:", role);
      navigate(role === "admin" ? "/admin-dashboard" : "/home");
    } catch (err) {
      console.error("Error fetching user role:", err);
      setError("Failed to log in. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const userCredential = await loginWithEmail(formData.email, formData.password);
      await handleLogin(userCredential.user);
    } catch (error) {
      setError(error.message);
      console.error("Login error:", error.message);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    try {
      const userCredential = await loginWithGoogle();
      await handleLogin(userCredential.user);
    } catch (error) {
      setError(error.message);
      console.error("Google login error:", error.message);
    }
  };

  return (
    <>
      <Header />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="card bg-base-100 w-96 shadow-sm p-6 rounded-2xl">
          <div className="card-body">
            <h2 className="card-title text-2xl font-bold text-center text-gray-700">Login</h2>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
              <div>
                <label className="label">Email</label>
                <input 
                  type="email" 
                  name="email" 
                  placeholder="Enter your email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  className="input input-bordered w-full" 
                  required 
                />
              </div>
              <div>
                <label className="label">Password</label>
                <input 
                  type="password" 
                  name="password" 
                  placeholder="Enter your password" 
                  value={formData.password} 
                  onChange={handleChange} 
                  className="input input-bordered w-full" 
                  required 
                />
              </div>
              <div className="card-actions flex flex-col gap-3">
                <button type="submit" className="btn btn-primary w-full">Login</button>
                <button 
                  type="button" 
                  onClick={handleGoogleLogin} 
                  className="btn btn-outline w-full flex items-center justify-center gap-2"
                >
                  <FcGoogle className="text-xl" /> 
                  Login with Google
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
