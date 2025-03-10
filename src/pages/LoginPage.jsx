import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import Header from "../components/Header";
import { loginWithEmail, loginWithGoogle } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle email & password login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await loginWithEmail(formData.email, formData.password);
      console.log("Login successful!");
      navigate("/"); // Redirect to Homepage
    } catch (error) {
      setError(error.message);
      console.error("Login error:", error.message);
    }
  };

  // Handle Google Login
  const handleGoogleLogin = async () => {
    setError("");
    try {
      await loginWithGoogle();
      console.log("Google login successful!");
      navigate("/"); // Redirect to Homepage
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
