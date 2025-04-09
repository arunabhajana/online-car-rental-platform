import React, { useEffect, useState } from "react";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { CalendarDaysIcon, ClockIcon } from "@heroicons/react/24/outline";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ nextStep, setPaymentResult }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError("");

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: undefined },
      redirect: "if_required",
    });

    if (result.error) {
      setError(result.error.message);
      setProcessing(false);
    } else if (result.paymentIntent?.status === "succeeded") {
      setPaymentResult({
        amount: result.paymentIntent.amount / 100,
        paymentIntentId: result.paymentIntent.id,
      });
      nextStep();
    } else {
      setError("Unexpected status. Please try again.");
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <PaymentElement />
      {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
      <div className="mt-6 flex justify-center gap-4">
        <button
          className="btn btn-success w-full sm:w-auto"
          type="submit"
          disabled={!stripe || processing}
        >
          {processing ? "Processing..." : "Pay Now"}
        </button>
      </div>
    </form>
  );
};

const Payment = ({
  nextStep,
  prevStep,
  bookingDetails,
  personalInfo,
  pricePerHour,
  setPaymentResult, 
}) => {
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState("");
  const [amount, setAmount] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const { pickupDate, pickupTime, dropoffDate, dropoffTime } = bookingDetails;
        if (!pickupDate || !pickupTime || !dropoffDate || !dropoffTime) {
          setError("Missing booking date/time details.");
          return;
        }

        const pickup = new Date(`${pickupDate}T${pickupTime}`);
        const dropoff = new Date(`${dropoffDate}T${dropoffTime}`);
        const hourlyRate = parseFloat(pricePerHour);

        if (isNaN(hourlyRate)) {
          setError("Invalid price per hour.");
          return;
        }

        const hours = Math.ceil((dropoff - pickup) / (1000 * 60 * 60));
        const amountInPaise = Math.ceil(hours * hourlyRate * 100);

        setDuration(hours);
        setAmount(amountInPaise / 100); 

        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/create-payment-intent`,
          { amount: amountInPaise },
          { headers: { "Content-Type": "application/json" } }
        );

        if (res.data?.clientSecret) {
          setClientSecret(res.data.clientSecret);
        } else {
          setError("Failed to get client secret.");
        }
      } catch (err) {
        setError("Failed to initialize payment.");
      }
    };

    createPaymentIntent();
  }, [bookingDetails, pricePerHour]);

  return (
    <div className="container mx-auto py-10 px-5 max-w-2xl">
      <h2 className="text-3xl font-bold text-center mb-6">Payment</h2>
      <p className="text-lg text-center mb-4">Complete your booking payment below</p>

      <div className="card shadow-lg bg-base-100 border mb-6">
        <div className="card-body">
          <h3 className="card-title text-lg font-bold">Booking Summary</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
            <div className="flex items-center gap-2">
              <CalendarDaysIcon className="w-5 h-5 text-primary" />
              <span>
                <span className="font-medium">Pickup:</span> {bookingDetails.pickupDate} {bookingDetails.pickupTime}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDaysIcon className="w-5 h-5 text-primary" />
              <span>
                <span className="font-medium">Dropoff:</span> {bookingDetails.dropoffDate} {bookingDetails.dropoffTime}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ClockIcon className="w-5 h-5 text-primary" />
              <span>
                <span className="font-medium">Duration:</span> {duration} hour(s)
              </span>
            </div>
            <div className="text-lg font-semibold">
              Total: ₹{amount.toLocaleString("en-IN")}
            </div>
          </div>
        </div>
      </div>

      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

      {clientSecret ? (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm nextStep={nextStep} setPaymentResult={setPaymentResult} />
        </Elements>
      ) : (
        <p className="text-center">Loading payment gateway...</p>
      )}

      <div className="mt-6 flex justify-center gap-4">
        <button className="btn btn-secondary" onClick={prevStep}>
          Back
        </button>
      </div>
    </div>
  );
};

export default Payment;
