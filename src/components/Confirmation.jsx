import React from "react";

const Confirmation = ({ prevStep }) => {
  return (
    <div>
      <div className="container mx-auto py-10 px-5 text-center">
        <h2 className="text-3xl font-bold mb-6">Booking Confirmation</h2>
        <p className="text-lg">Your booking has been confirmed. Thank you!</p>

        <div className="mt-6 flex justify-center">
          <button className="btn btn-secondary" onClick={prevStep}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
