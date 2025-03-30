import React from "react";

const BookingDetails = ({ nextStep, prevStep }) => {
  return (
    <div>
      <div className="container mx-auto py-10 px-5 text-center">
        <h2 className="text-3xl font-bold mb-6">Booking Details</h2>
        <p className="text-lg">This is a placeholder for booking details.</p>

        <div className="mt-6 flex justify-center gap-4">
          <button className="btn btn-secondary" onClick={prevStep}>
            Back
          </button>
          <button className="btn btn-success" onClick={nextStep}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
