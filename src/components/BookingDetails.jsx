import { useEffect, useState } from "react";
import { FaCar, FaGasPump, FaCogs, FaUsers, FaCalendarAlt, FaMapMarkerAlt, FaEnvelope, FaPhone, FaIdCard } from "react-icons/fa";

const BookingDetails = ({ bookingDetails: initialBookingDetails, personalInfo: initialPersonalInfo, nextStep , prevStep }) => {
  const [bookingDetails, setBookingDetails] = useState(initialBookingDetails || {});
  const [personalInfo, setPersonalInfo] = useState(initialPersonalInfo || {});

  useEffect(() => {
    console.log("Updated Booking Details:", bookingDetails);
  }, [bookingDetails]);

  const handleBookingChange = (e) => {
    setBookingDetails({ ...bookingDetails, [e.target.name]: e.target.value });
  };

  const handlePersonalChange = (e) => {
    setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value });
  };

  const saveBooking = () => {
    document.getElementById("time_modal").close();
  };

  const savePersonal = () => {
    document.getElementById("personal_modal").close();
  };

  return (
    <div className="container mx-auto py-10 px-5">
      <h2 className="text-3xl font-bold text-center mb-6">Booking Details</h2>
      <h3 className="text-lg font-semibold text-center mb-4 text-gray-600">Confirm Your Booking Details To Continue</h3>

      {/* Vehicle Details */}
      <div className="card p-6 shadow-lg rounded-lg mb-6 flex flex-col md:flex-row items-center md:items-start">
        {/* Vehicle Details on the Left */}
        <div className="w-full md:w-2/3 text-left">
          <h3 className="text-xl font-semibold mb-4">Vehicle Details</h3>
          {bookingDetails.vehicle ? (
            <div className="space-y-2">
              <p className="flex items-center gap-2"><FaCar /> <strong>{bookingDetails.vehicle.brand} {bookingDetails.vehicle.model} ({bookingDetails.vehicle.year})</strong></p>
              <p className="flex items-center gap-2"><FaGasPump /> <strong>Fuel Type:</strong> {bookingDetails.vehicle.fuelType}</p>
              <p className="flex items-center gap-2"><FaCogs /> <strong>Transmission:</strong> {bookingDetails.vehicle.transmission}</p>
              <p className="flex items-center gap-2"><FaUsers /> <strong>Capacity:</strong> {bookingDetails.vehicle.capacity} Seats</p>
            </div>
          ) : (
            <p className="text-red-500">No vehicle selected.</p>
          )}
        </div>

        {/* Vehicle Image on the Right */}
        {bookingDetails.vehicle?.imageUrl && (
          <div className="w-full md:w-1/3 flex justify-center md:justify-end mt-4 md:mt-0">
            <img
              src={bookingDetails.vehicle.imageUrl}
              alt={`${bookingDetails.vehicle.brand} ${bookingDetails.vehicle.model}`}
              className="rounded-lg w-80 h-52 object-cover"
            />
          </div>
        )}
      </div>

      {/* Time Slot Details */}
      <div className="card p-6 shadow-lg rounded-lg mb-6 text-left">
        <h3 className="text-xl font-semibold mb-4">Time Slot</h3>
        <div className="space-y-2">
          <p className="flex items-center gap-2"><FaCalendarAlt /> <strong>Pickup Date:</strong> {bookingDetails?.pickupDate?.split("T")[0]} at {bookingDetails?.pickupTime}</p>
          <p className="flex items-center gap-2"><FaCalendarAlt /> <strong>Dropoff Date:</strong> {bookingDetails?.dropoffDate?.split("T")[0]} at {bookingDetails?.dropoffTime}</p>
          <p className="flex items-center gap-2"><FaMapMarkerAlt /> <strong>Pickup Location:</strong> {bookingDetails?.pickupLocation}</p>
          <p className="flex items-center gap-2"><FaMapMarkerAlt /> <strong>Dropoff Location:</strong> {bookingDetails?.dropoffLocation}</p>
          <button className="btn btn-primary mt-4" onClick={() => document.getElementById('time_modal').showModal()}>Edit</button>
        </div>
      </div>

      {/* Personal Details */}
      <div className="card p-6 shadow-lg rounded-lg mb-6 text-left">
        <h3 className="text-xl font-semibold mb-4">Personal Details</h3>
        <div className="space-y-2">
          <p className="flex items-center gap-2"><FaIdCard /> <strong>Name:</strong> {personalInfo?.firstName} {personalInfo?.lastName}</p>
          <p className="flex items-center gap-2"><FaPhone /> <strong>Mobile:</strong> {personalInfo?.mobileNumber}</p>
          <p className="flex items-center gap-2"><FaEnvelope /> <strong>Email:</strong> {personalInfo?.email}</p>
          <p className="flex items-center gap-2"><FaMapMarkerAlt /> <strong>Address:</strong> {personalInfo?.address1}, {personalInfo?.address2}, {personalInfo?.city}, {personalInfo?.state}, {personalInfo?.postalCode}</p>
          <button className="btn btn-primary mt-4" onClick={() => document.getElementById('personal_modal').showModal()}>Edit</button>
        </div>
      </div>

      {/* Time Slot Modal */}
      <dialog id="time_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Edit Time Slot</h3>
          <input type="date" name="pickupDate" value={bookingDetails.pickupDate} onChange={handleBookingChange} className="input input-bordered w-full mt-2" />
          <input type="time" name="pickupTime" value={bookingDetails.pickupTime} onChange={handleBookingChange} className="input input-bordered w-full mt-2" />
          <input type="date" name="dropoffDate" value={bookingDetails.dropoffDate} onChange={handleBookingChange} className="input input-bordered w-full mt-2" />
          <input type="time" name="dropoffTime" value={bookingDetails.dropoffTime} onChange={handleBookingChange} className="input input-bordered w-full mt-2" />
          <input type="text" name="pickupLocation" value={bookingDetails.pickupLocation} onChange={handleBookingChange} className="input input-bordered w-full mt-2" />
          <input type="text" name="dropoffLocation" value={bookingDetails.dropoffLocation} onChange={handleBookingChange} className="input input-bordered w-full mt-2" />
          <button className="btn btn-primary mt-4" onClick={saveBooking}>Save</button>
        </div>
      </dialog>

      {/* Personal Details Modal */}
      <dialog id="personal_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Edit Personal Details</h3>
          <input type="text" name="firstName" value={personalInfo.firstName} onChange={handlePersonalChange} className="input input-bordered w-full mt-2" />
          <input type="text" name="lastName" value={personalInfo.lastName} onChange={handlePersonalChange} className="input input-bordered w-full mt-2" />
          <input type="text" name="mobileNumber" value={personalInfo.mobileNumber} onChange={handlePersonalChange} className="input input-bordered w-full mt-2" />
          <input type="email" name="email" value={personalInfo.email} onChange={handlePersonalChange} className="input input-bordered w-full mt-2" />
          <input type="text" name="address1" value={personalInfo.address1} onChange={handlePersonalChange} className="input input-bordered w-full mt-2" />
          <input type="text" name="address2" value={personalInfo.address2} onChange={handlePersonalChange} className="input input-bordered w-full mt-2" />
          <button className="btn btn-primary mt-4" onClick={savePersonal}>Save</button>
        </div>
      </dialog>

      <div className="flex justify-center gap-4 mt-6">
        <button className="btn btn-secondary w-60" onClick={prevStep}>
          Back
        </button>
        <button className="btn btn-success w-60" onClick={nextStep}>
          Confirm Booking
        </button>
      </div>


    </div>
  );
};

export default BookingDetails;
