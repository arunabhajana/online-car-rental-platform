import { useState } from "react";

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted", formData);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="card bg-base-100 w-96 shadow-sm p-6 rounded-2xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold text-center text-gray-700">Register</h2>
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
            <div className="card-actions justify-end">
              <button type="submit" className="btn btn-primary w-full">Register</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;