import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { UserIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import { collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebaseConfig";

const Confirmation = ({ bookingDetails, personalInfo, vehicle, paymentResult }) => {
  const navigate = useNavigate();
  const bookingSaved = useRef(false);
  const auth = getAuth();

  const handleGoHome = () => {
    navigate("/home");
  };

  const fullName = `${personalInfo.firstName} ${personalInfo.middleName} ${personalInfo.lastName}`.trim();

  const calculateDuration = (start, end) => {
    const d1 = new Date(start);
    const d2 = new Date(end);
    const diffTime = Math.abs(d2 - d1);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  useEffect(() => {
    if (bookingSaved.current) return;

    const saveBookingToFirestore = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.error("❌ User not authenticated");
          return;
        }

        const bookingData = {
          userId: user.uid,
          fullName,
          email: personalInfo.email,
          mobileNumber: personalInfo.mobileNumber,
          address: {
            address1: personalInfo.address1,
            address2: personalInfo.address2,
            city: personalInfo.city,
            state: personalInfo.state,
            postalCode: personalInfo.postalCode,
          },
          dob: personalInfo.dob,
          documentNumber: personalInfo.documentNumber,
          proofOfAddress: personalInfo.proofOfAddress,
          vehicle: {
            id: vehicle?.id,
            brand: vehicle?.brand,
            model: vehicle?.model,
            year: vehicle?.year,
            transmission: vehicle?.transmission,
            capacity: vehicle?.capacity,
            pricePerHour: vehicle?.pricePerHour,
            imageUrl: vehicle?.imageUrl,
          },
          bookingDetails: {
            pickupDate: bookingDetails.pickupDate,
            pickupTime: bookingDetails.pickupTime,
            dropoffDate: bookingDetails.dropoffDate,
            dropoffTime: bookingDetails.dropoffTime,
            pickupLocation: bookingDetails.pickupLocation,
            dropoffLocation: bookingDetails.dropoffLocation,
          },
          payment: {
            amount: paymentResult?.amount || 0,
            paymentIntentId: paymentResult?.paymentIntentId || "",
          },
          createdAt: new Date(),
        };

        await addDoc(collection(db, "bookings"), bookingData);
        bookingSaved.current = true;
        console.log("✅ Booking saved to Firestore");

        await fetch(`${emailUrl}/send-booking-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userEmail: personalInfo.email,
            carName: `${vehicle?.brand} ${vehicle?.model}`,
            date: bookingDetails.pickupDate,
            duration: calculateDuration(bookingDetails.pickupDate, bookingDetails.dropoffDate),
            total: paymentResult?.amount || 0,
          }),
        });
        
        console.log("✅ Booking confirmation email sent");

      } catch (err) {
        console.error("❌ Failed to save booking to Firestore or send email:", err);
      }
    };

    saveBookingToFirestore();
  }, [bookingDetails, personalInfo, vehicle, paymentResult, fullName, auth]);

  return (
    <div className="container mx-auto py-10 px-5 text-center max-w-4xl">
      <h2 className="text-4xl font-bold text-green-600 mb-6">🎉 Payment Successful!</h2>
      <p className="text-lg mb-4">Your booking has been confirmed. Thank you for choosing us!</p>

      <div className="bg-white p-6 rounded-lg shadow-md mt-8 flex flex-col md:flex-row gap-6 border items-center">
        <div className="flex-1 text-left">
          <h3 className="text-xl font-semibold mb-2">Vehicle Details</h3>
          <ul className="space-y-2 text-sm sm:text-base">
            <li><span className="font-medium">Car:</span> {vehicle?.brand} {vehicle?.model} ({vehicle?.year})</li>
            <li><span className="font-medium">Price/Hour:</span> ₹{vehicle?.pricePerHour}</li>
            <li className="flex items-center gap-2">
              <Cog6ToothIcon className="w-5 h-5 text-gray-600" />
              <span className="font-medium">Transmission:</span> {vehicle?.transmission}
            </li>
            <li className="flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-gray-600" />
              <span className="font-medium">Seating Capacity:</span> {vehicle?.capacity} people
            </li>
          </ul>
        </div>

        {vehicle?.imageUrl && (
          <div className="flex-shrink-0 w-full md:w-56">
            <img
              src={vehicle.imageUrl}
              alt={`${vehicle.brand} ${vehicle.model}`}
              className="rounded-lg shadow w-full h-auto object-cover"
            />
          </div>
        )}
      </div>

      <div className="bg-gray-100 p-6 rounded-lg shadow-md text-left mt-8 border">
        <h3 className="text-xl font-semibold mb-4">Booking Summary</h3>
        <ul className="space-y-2 text-sm sm:text-base">
          <li><span className="font-medium">Name:</span> {fullName}</li>
          <li><span className="font-medium">Email:</span> {personalInfo.email}</li>
          <li><span className="font-medium">Phone:</span> {personalInfo.mobileNumber}</li>
          <li><span className="font-medium">Pickup:</span> {bookingDetails.pickupDate} at {bookingDetails.pickupTime}</li>
          <li><span className="font-medium">Dropoff:</span> {bookingDetails.dropoffDate} at {bookingDetails.dropoffTime}</li>
          <li><span className="font-medium">Pickup Location:</span> {bookingDetails.pickupLocation}</li>
          <li><span className="font-medium">Dropoff Location:</span> {bookingDetails.dropoffLocation}</li>
          {paymentResult?.amount && (
            <li><span className="font-medium">Paid Amount:</span> ₹{paymentResult.amount.toLocaleString("en-IN")}</li>
          )}
        </ul>
      </div>

      <div className="mt-8 flex justify-center">
        <button className="btn btn-primary" onClick={handleGoHome}>
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default Confirmation;
