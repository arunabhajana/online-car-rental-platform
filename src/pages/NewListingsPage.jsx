import React from "react";
import Header from "../components/Header";

const NewListingsPage = () => {
  return (
    <>
    <Header />
    <div className="container mx-auto py-10 px-5">
      <h1 className="text-3xl font-bold text-center mb-8">Create New Listing</h1>
      <div className="max-w-lg mx-auto bg-white p-6 shadow-md rounded-lg">
        <form className="space-y-4">
          <div>
            <label className="label">
              <span className="label-text">Car Brand</span>
            </label>
            <input type="text" placeholder="Enter car brand" className="input input-bordered w-full" />
          </div>
          <div>
            <label className="label">
              <span className="label-text">Car Model</span>
            </label>
            <input type="text" placeholder="Enter car model" className="input input-bordered w-full" />
          </div>
          <div>
            <label className="label">
              <span className="label-text">Car Year</span>
            </label>
            <input type="number" placeholder="Enter car year" className="input input-bordered w-full" />
          </div>
          <div>
            <label className="label">
              <span className="label-text">Fuel Type</span>
            </label>
            <select className="select select-bordered w-full">
              <option>Petrol</option>
              <option>Diesel</option>
              <option>Electric</option>
              <option>Hybrid</option>
            </select>
          </div>
          <div>
            <label className="label">
              <span className="label-text">Capacity</span>
            </label>
            <input type="number" placeholder="Enter capacity (seats)" className="input input-bordered w-full" />
          </div>
          <div>
            <label className="label">
              <span className="label-text">Transmission</span>
            </label>
            <select className="select select-bordered w-full">
              <option>Automatic</option>
              <option>Manual</option>
            </select>
          </div>
          <div>
            <label className="label">
              <span className="label-text">Location</span>
            </label>
            <input type="text" placeholder="Enter location" className="input input-bordered w-full" />
          </div>
          <div className="text-center mt-4">
            <button className="btn btn-primary w-full">Submit Listing</button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
};

export default NewListingsPage;
