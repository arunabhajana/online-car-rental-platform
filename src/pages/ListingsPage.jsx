import React from "react";
import Header from "../components/Header";

const ListingsPage = () => {
  const listings = [
    {
      id: 1,
      brand: "Toyota",
      model: "Camry",
      year: 2022,
      fuelType: "Petrol",
      transmission: "Automatic",
      location: "New York",
    },
    {
      id: 2,
      brand: "Honda",
      model: "Civic",
      year: 2020,
      fuelType: "Diesel",
      transmission: "Manual",
      location: "California",
    },
    {
      id: 3,
      brand: "Tesla",
      model: "Model 3",
      year: 2023,
      fuelType: "Electric",
      transmission: "Automatic",
      location: "Texas",
    },
  ];

  return (
    <>
      <Header />
      <div className="container mx-auto py-10 px-5">
        <h1 className="text-3xl font-bold text-center mb-8">My Listings</h1>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>
                  <label>
                    <input type="checkbox" className="checkbox" />
                  </label>
                </th>
                <th>Serial No</th>
                <th>Car</th>
                <th>Fuel Type</th>
                <th>Transmission</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((listing, index) => (
                <tr key={listing.id}>
                  <th>
                    <label>
                      <input type="checkbox" className="checkbox" />
                    </label>
                  </th>
                  <td>{index + 1}</td>
                  <td>
                    <div>
                      <div className="font-bold">{listing.brand}</div>
                      <div className="text-sm opacity-70">
                        {listing.model} - {listing.year}
                      </div>
                    </div>
                  </td>
                  <td>{listing.fuelType}</td>
                  <td>{listing.transmission}</td>
                  <td>{listing.location}</td>
                  <td>
                    <button className="btn btn-soft btn-info">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ListingsPage;
