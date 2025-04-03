import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import Header from "../components/Header";
import SelectVehicle from "../components/SelectVehicle";
import PersonalDetails from "../components/PersonalDetails";
import BookingDetails from "../components/BookingDetails";
import Payment from "../components/Payment";
import Confirmation from "../components/Confirmation";
import { ProgressSpinner } from "primereact/progressspinner";

const BookingPage = () => {
  const { id } = useParams(); // Get car ID from URL
  const [step, setStep] = useState(1);
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState("");

  // Booking details state (shared across steps)
  const [bookingDetails, setBookingDetails] = useState({
    pickupDate: "",
    pickupTime: "",
    dropoffDate: "",
    dropoffTime: "",
    pickupLocation: "",
    dropoffLocation: "",
  });

  // Personal details state (added)
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    dob: "",
    mobileNumber: "",
    email: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    postalCode: "",
    proofOfAddress: "",
    documentNumber: "",
  });

  useEffect(() => {
    const fetchCarDetails = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "car", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const carData = { id: docSnap.id, ...docSnap.data() };
          setCar(carData);
          setLocation(carData.location || "");
        } else {
          console.error("Car not found");
        }
      } catch (error) {
        console.error("Error fetching car details:", error);
      }
      setLoading(false);
    };

    fetchCarDetails();
  }, [id]);

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 5));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const renderStep = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <ProgressSpinner />
        </div>
      );
    }

    if (!car) {
      return <p className="text-center text-lg text-red-500">Car details not found.</p>;
    }

    switch (step) {
      case 1:
        return <SelectVehicle nextStep={nextStep} car={car} setBookingDetails={setBookingDetails} location={location} />;
      case 2:
        return <PersonalDetails nextStep={nextStep} prevStep={prevStep} personalInfo={personalInfo} setPersonalInfo={setPersonalInfo} />;
      case 3:
        return <BookingDetails nextStep={nextStep} prevStep={prevStep} car={car} bookingDetails={bookingDetails} personalInfo={personalInfo} />;
      case 4:
        return <Payment nextStep={nextStep} prevStep={prevStep} bookingDetails={bookingDetails} personalInfo={personalInfo} />;
      case 5:
        return <Confirmation prevStep={prevStep} bookingDetails={bookingDetails} personalInfo={personalInfo} />;
      default:
        return <SelectVehicle nextStep={nextStep} car={car} setBookingDetails={setBookingDetails} location={location} />;
    }
  };

  return (
    <>
      <Header />
      <div className="container mx-auto py-10 px-5 text-center">
        <ul className="steps steps-vertical lg:steps-horizontal justify-center mb-10">
          <li className={`step ${step >= 1 ? "step-primary" : ""}`}>Select Vehicle & Options</li>
          <li className={`step ${step >= 2 ? "step-primary" : ""}`}>Personal Details</li>
          <li className={`step ${step >= 3 ? "step-primary" : ""}`}>Booking Details</li>
          <li className={`step ${step >= 4 ? "step-primary" : ""}`}>Payment</li>
          <li className={`step ${step >= 5 ? "step-primary" : ""}`}>Payment Confirmation</li>
        </ul>

        {renderStep()}
      </div>
    </>
  );
};

export default BookingPage;
