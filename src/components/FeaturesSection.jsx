import { FaHeadset, FaDollarSign, FaCarSide, FaGlobe } from "react-icons/fa";

const FeaturesSection = () => {
  return (
    <div className="container mx-auto py-16 flex flex-col items-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-center max-w-2xl">
        <div className="flex flex-col items-center">
          <FaHeadset className="text-5xl text-blue-500" />
          <h3 className="font-semibold mt-2">24-Hour Roadside Assistance</h3>
          <p className="text-gray-600">For peace of mind.</p>
        </div>
        <div className="flex flex-col items-center">
          <FaDollarSign className="text-5xl text-green-500" />
          <h3 className="font-semibold mt-2">No Hidden Charges</h3>
          <p className="text-gray-600">What you see is what you pay.</p>
        </div>
        <div className="flex flex-col items-center">
          <FaCarSide className="text-5xl text-orange-500" />
          <h3 className="font-semibold mt-2">Distinctive Fleet</h3>
          <p className="text-gray-600">Choose from a wide selection of premium vehicles.</p>
        </div>
        <div className="flex flex-col items-center">
          <FaGlobe className="text-5xl text-purple-500" />
          <h3 className="font-semibold mt-2">Unlimited Mileage</h3>
          <p className="text-gray-600">Explore cities and beyond without limits.</p>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
