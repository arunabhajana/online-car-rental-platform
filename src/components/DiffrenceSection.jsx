import { FaCar, FaCalendarCheck, FaTags, FaClipboardCheck, FaClock, FaHeadset } from "react-icons/fa";

const DiffrenceSection = () => {
  return (
    <div className="container mx-auto py-16 text-center">
      <h2 className="text-3xl font-bold text-gray-800">What Makes Us Different</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-16 gap-x-8 mt-10 bg-gray-200 p-10 rounded-lg max-w-6xl mx-auto">
        <div className="flex flex-col items-center p-6 bg-white shadow-md rounded-lg">
          <FaCar className="text-5xl text-blue-500" />
          <h3 className="font-semibold mt-2">Wide Range Of Vehicles</h3>
          <p className="text-gray-600">From compact cars to luxury SUVs, we have the perfect car for your trip.</p>
        </div>
        <div className="flex flex-col items-center p-6 bg-white shadow-md rounded-lg">
          <FaCalendarCheck className="text-5xl text-green-500" />
          <h3 className="font-semibold mt-2">Flexible Pick-Up & Drop-Off</h3>
          <p className="text-gray-600">Convenient locations and flexible scheduling for a hassle-free experience.</p>
        </div>
        <div className="flex flex-col items-center p-6 bg-white shadow-md rounded-lg">
          <FaTags className="text-5xl text-orange-500" />
          <h3 className="font-semibold mt-2">Excellent Prices</h3>
          <p className="text-gray-600">Top-quality cars at unbeatable rates.</p>
        </div>
        <div className="flex flex-col items-center p-6 bg-white shadow-md rounded-lg">
          <FaClipboardCheck className="text-5xl text-blue-500" />
          <h3 className="font-semibold mt-2">Easy Online Booking</h3>
          <p className="text-gray-600">Book your car in minutes with our user-friendly platform.</p>
        </div>
        <div className="flex flex-col items-center p-6 bg-white shadow-md rounded-lg">
          <FaClock className="text-5xl text-green-500" />
          <h3 className="font-semibold mt-2">Instant Booking</h3>
          <p className="text-gray-600">Receive immediate confirmation for a hassle-free rental.</p>
        </div>
        <div className="flex flex-col items-center p-6 bg-white shadow-md rounded-lg">
          <FaHeadset className="text-5xl text-purple-500" />
          <h3 className="font-semibold mt-2">24/7 Customer Support</h3>
          <p className="text-gray-600">Our team is available around the clock to assist you.</p>
        </div>
      </div>
    </div>
  );
};

export default DiffrenceSection;
