import { useState } from "react";
import { auth } from "../firebaseConfig.js";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    acceptTerms: false,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!formData.acceptTerms) {
      setError("You must accept the Terms and Conditions.");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: formData.name });

      console.log("User registered:", user);
      setSuccess(true);
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (err) {
      setError(err.message);
      console.error("Registration Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="card bg-base-100 w-96 shadow-sm p-6 rounded-2xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold text-center text-gray-700">Register</h2>

          {/* Error Alert */}
          {error && (
            <div role="alert" className="alert alert-error mt-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M18 12H6m6-6v12"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Success Alert */}
          {success && (
            <div role="alert" className="alert alert-success mt-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Your account has been Created Successfully! Redirecting you back...</span>
            </div>
          )}

          <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
            <div>
              <label className="label">Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
            </div>
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
            <div>
              <label className="label">Phone Number</label>
              <input
                type="tel"
                name="phone"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
            </div>

            {/* Terms & Conditions Checkbox */}
            <div className="form-control">
              <label className="label cursor-pointer flex gap-2">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  className="checkbox checkbox-primary"
                />
                <span className="text-sm">
                  I accept the <a href="/terms" className="text-primary underline">Terms & Conditions</a>
                </span>
              </label>
            </div>

            <div className="card-actions justify-end">
              <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                {loading ? "Registering..." : "Register"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
