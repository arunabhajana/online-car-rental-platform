import { useState } from "react";
import Header from "../components/Header";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login Attempt", formData);
  };

  return (
    <>
    <Header />
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="card bg-base-100 w-96 shadow-sm p-6 rounded-2xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold text-center text-gray-700">Login</h2>
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
            <div className="card-actions justify-end">
              <button type="submit" className="btn btn-primary w-full">Login</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </>
  );
};

export default LoginPage;
