import React, { useState, useEffect, useRef } from "react";
import { Card } from "primereact/card";
import { FaGasPump, FaCogs, FaUsers, FaCalendarAlt } from "react-icons/fa";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import Calendar from "react-calendar";
import "react-datepicker/dist/react-datepicker.css";
import "react-calendar/dist/Calendar.css";
import { db } from "../firebaseConfig";
import "../App.css"
import { collection, query, where, getDocs } from "firebase/firestore";

const SelectVehicle = ({ nextStep, car, setBookingDetails }) => {
  const [pickupDate, setPickupDate] = useState(null);
  const [pickupTime, setPickupTime] = useState(null);
  const [dropoffDate, setDropoffDate] = useState(null);
  const [dropoffTime, setDropoffTime] = useState(null);
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [error, setError] = useState("");
  const [locationOptions, setLocationOptions] = useState([]);
  const [bookedDateTimeRanges, setBookedDateTimeRanges] = useState([]);
  const [bookedDates, setBookedDates] = useState(new Set());
  const [partiallyBookedDates, setPartiallyBookedDates] = useState(new Set());
  const [tooltipMap, setTooltipMap] = useState({});
  const pickupTimeRef = useRef(null);
  const availableFrom = car?.availableFrom?.toDate ? format(car.availableFrom.toDate(), "yyyy-MM-dd HH:mm") : null;
  const availableTill = car?.availableTill?.toDate ? format(car.availableTill.toDate(), "yyyy-MM-dd HH:mm") : null;
  const minDate = car?.availableFrom?.toDate?.() || null;
  const maxDate = car?.availableTill?.toDate?.() || null;


  const locationMappings = {
    Hyderabad: ["Ameerpet", "Miyapur", "Gachibowli", "LB Nagar", "Uppal", "Tarnaka", "Madhapur", "Secunderabad", "Paradise", "Malakpet", "Nampally", "Khairatabad", "Kukatpally", "JNTU"],
    Chennai: ["Tambaram", "Meenambakkam", "Pallavaram", "Chrompet", "Anna Nagar", "Guduvanchery", "T. Nagar", "Guindy", "Velachery", "Adyar", "Perambur"]
  };

  useEffect(() => {
    if (car?.location && locationMappings[car.location]) {
      setLocationOptions(locationMappings[car.location]);
    } else {
      setLocationOptions([]);
    }
  }, [car]);
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const q = query(collection(db, "bookings"), where("vehicle.id", "==", car?.id));
        const snapshot = await getDocs(q);
        const ranges = [];
        const fullBooked = new Set();
        const partialBooked = new Set();
        const tooltips = {};

        snapshot.forEach((doc) => {
          const details = doc.data().bookingDetails;
          if (!details?.pickupDate || !details?.pickupTime || !details?.dropoffDate || !details?.dropoffTime) return;

          const start = new Date(`${details.pickupDate}T${details.pickupTime}`);
          const end = new Date(`${details.dropoffDate}T${details.dropoffTime}`);
          ranges.push({ start, end });

          const dateKey = format(start, "yyyy-MM-dd");
          const timeLabel = `${details.pickupTime}` - `${details.dropoffTime}`;
          tooltips[dateKey] = (tooltips[dateKey] || []).concat(timeLabel);

          const totalHours = (end - start) / (1000 * 60 * 60);
          for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            const dateStr = format(new Date(d), "yyyy-MM-dd");
            if (totalHours < 24) partialBooked.add(dateStr);
            else fullBooked.add(dateStr);
          }
        });

        setBookedDateTimeRanges(ranges);
        setBookedDates(fullBooked);
        setPartiallyBookedDates(partialBooked);
        setTooltipMap(tooltips);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };

    if (car?.id) fetchBookings();
  }, [car?.id]);


  const isWithinAvailability = (dateStr) => {
    if (!car.availableFrom || !car.availableTill) return false;
    const from = car.availableFrom.toDate();
    const till = car.availableTill.toDate();
    const selectedDate = new Date(dateStr);
    return selectedDate >= from && selectedDate <= till;
  };

  const isTimeRangeBlocked = (start, end) =>
    bookedDateTimeRanges.some(({ start: s, end: e }) =>
      (start >= s && start < e) || (end > s && end <= e) || (start <= s && end >= e)
    );

  const filterAvailableTime = (type) => (time) => {
    const date = type === "pickup" ? pickupDate : dropoffDate;
    if (!date) return true;
    const t = format(time, "HH:mm");
    const fullStart = new Date(`${format(date, "yyyy-MM-dd")}T${t}`);
    const fullEnd = new Date(fullStart.getTime() + 30 * 60 * 1000);
    return !isTimeRangeBlocked(fullStart, fullEnd);
  };

  const handleContinue = () => {
    if (!pickupDate || !pickupTime || !dropoffDate || !dropoffTime || !pickupLocation || !dropoffLocation) {
      setError("Please fill all fields before proceeding.");
      return;
    }

    const pickupDateStr = format(pickupDate, "yyyy-MM-dd");
    const dropoffDateStr = format(dropoffDate, "yyyy-MM-dd");
    const formattedPickupTime = format(pickupTime, "HH:mm");
    const formattedDropoffTime = format(dropoffTime, "HH:mm");

    const fullPickup = new Date(`${pickupDateStr}T${formattedPickupTime}`);
    const fullDropoff = new Date(`${dropoffDateStr}T${formattedDropoffTime}`);

    if (!isWithinAvailability(pickupDateStr) || !isWithinAvailability(dropoffDateStr)) {
      setError("Selected dates are outside the car's availability range.");
      return;
    }

    if (isTimeRangeBlocked(fullPickup, fullDropoff)) {
      setError("Selected time range overlaps with an existing booking.");
      return;
    }

    if (fullPickup.getTime() === fullDropoff.getTime()) {
      setError("Pickup and Dropoff time cannot be the same.");
      return;
    }

    setError("");
    setBookingDetails((prev) => ({
      ...prev,
      vehicle: {
        id: car.id,
        brand: car.brand,
        model: car.model,
        year: car.year,
        fuelType: car.fuelType,
        transmission: car.transmission,
        capacity: car.capacity,
        imageUrl: car.imageUrl,
      },
      pickupDate: pickupDateStr,
      pickupTime: formattedPickupTime,
      dropoffDate: dropoffDateStr,
      dropoffTime: formattedDropoffTime,
      pickupLocation,
      dropoffLocation,
    }));
    nextStep();
  };

  const scrollToTime = () => {
    if (pickupTimeRef.current) {
      pickupTimeRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };
  return (
    <>
      <Card className="p-6 shadow-lg rounded-lg mb-6 text-center">
        <img src={car.imageUrl} alt={car.model} className="rounded-lg mx-auto mb-4 w-80 h-52 object-cover" />
        <h2 className="text-2xl font-semibold mb-4">
          {car.brand} {car.model} ({car.year})
        </h2>

        <div className="space-y-2 text-lg">
          <p className="flex items-center justify-center gap-2"><FaGasPump /> {car.fuelType}</p>
          <p className="flex items-center justify-center gap-2"><FaCogs /> {car.transmission}</p>
          <p className="flex items-center justify-center gap-2"><FaUsers /> {car.capacity} Seats</p>
          {availableFrom && availableTill ? (
            <p className="flex items-center justify-center gap-2 text-green-600 font-semibold">
              <FaCalendarAlt /> Available: {availableFrom} - {availableTill}
            </p>
          ) : (
            <p className="text-red-500">Availability not provided.</p>
          )}
        </div>
      </Card>
      <Card className="p-6 shadow-lg rounded-lg mb-6">
        <h2 className="text-2xl font-semibold mb-10 text-center">Select Pickup and Dropoff Details</h2>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 items-start">
          <div className="space-y-6 w-full max-w-xl pt-6 mt-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Pickup Date</label>
                <DatePicker
                  selected={pickupDate}
                  onChange={(date) => setPickupDate(date)}
                  dateFormat="yyyy-MM-dd"
                  minDate={minDate}
                  maxDate={maxDate}
                  className="input input-bordered w-full min-w-[250px]"
                />
              </div>
              <div ref={pickupTimeRef}>
                <label className="block font-semibold mb-1">Pickup Time</label>
                <DatePicker
                  selected={pickupTime}
                  onChange={(time) => setPickupTime(time)}
                  showTimeSelectOnly
                  showTimeSelect
                  timeIntervals={30}
                  dateFormat="HH:mm"
                  filterTime={filterAvailableTime("pickup")}
                  className="input input-bordered w-full min-w-[250px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Dropoff Date</label>
                <DatePicker
                  selected={dropoffDate}
                  onChange={(date) => setDropoffDate(date)}
                  dateFormat="yyyy-MM-dd"
                  minDate={minDate}
                  maxDate={maxDate}
                  className="input input-bordered w-full min-w-[250px]"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Dropoff Time</label>
                <DatePicker
                  selected={dropoffTime}
                  onChange={(time) => setDropoffTime(time)}
                  showTimeSelectOnly
                  showTimeSelect
                  timeIntervals={30}
                  dateFormat="HH:mm"
                  filterTime={filterAvailableTime("dropoff")}
                  className="input input-bordered w-full min-w-[250px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Pickup Location</label>
                <select
                  className="select select-bordered w-full min-w-[250px]"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                >
                  <option value="">Select a location</option>
                  {locationOptions.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1">Dropoff Location</label>
                <select
                  className="select select-bordered w-full min-w-[250px]"
                  value={dropoffLocation}
                  onChange={(e) => setDropoffLocation(e.target.value)}
                >
                  <option value="">Select a location</option>
                  {locationOptions.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
            </div>

            {error && <p className="text-red-500">{error}</p>}
          </div>


          <div className="w-full max-w-xl">
            <label className="block font-semibold mb-3 text-center xl:text-left">Availability Preview</label>
            <Calendar
              onClickDay={(value) => {
                if (isWithinAvailability(format(value, "yyyy-MM-dd"))) {
                  setPickupDate(value);
                  scrollToTime();
                }
              }}
              tileClassName={({ date }) => {
                const dateStr = format(date, "yyyy-MM-dd");
                const base = isWithinAvailability(dateStr)
                  ? (bookedDates.has(dateStr)
                    ? "booked-date"
                    : partiallyBookedDates.has(dateStr)
                      ? "partial-date"
                      : "available-date")
                  : "";
                const tip = tooltipMap[dateStr]?.join(", ");
                return `${base}${tip ? ` tooltip` : ""}`;
              }}
              tileContent={({ date }) => {
                const dateStr = format(date, "yyyy-MM-dd");
                const tip = tooltipMap[dateStr];
                return tip ? <div title={tip.join(", ")} /> : null;
              }}

              minDate={minDate}
              maxDate={maxDate}
            />
            <div className="mt-3 text-sm text-center xl:text-left ml-25">
              <span className="inline-block w-4 h-4 bg-green-400 mr-2 rounded-sm"></span> Available
              <span className="inline-block w-4 h-4 bg-yellow-300 ml-4 mr-2 rounded-sm"></span> Partially Booked
              <span className="inline-block w-4 h-4 bg-red-400 ml-4 mr-2 rounded-sm"></span> Fully Booked
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-10">
          <button className="btn btn-success w-full max-w-xs" onClick={handleContinue}>
            Continue
          </button>
        </div>
      </Card>
    </>
  );
};

export default SelectVehicle;