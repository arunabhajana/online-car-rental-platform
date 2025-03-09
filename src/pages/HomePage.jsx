import Footer from "../components/Footer";
import Header from "../components/Header";
import { FaCar, FaDollarSign, FaGlobe, FaHeadset, FaClipboardCheck, FaCalendarCheck, FaTags, FaCarSide, FaClock } from "react-icons/fa";
import SearchSection from "../components/SearchSection";
import DiffrenceSection from "../components/DiffrenceSection";
import FeaturesSection from "../components/FeaturesSection";

const HomePage = () => {
    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-100">
                <div className="container mx-auto py-10 text-center">
                    <h1 className="text-3xl font-bold text-gray-800">Top Car Rental Deals</h1>
                    <p className="text-lg text-gray-600 mt-2">Book your Car today!</p>
                </div>
                <SearchSection />
                <FeaturesSection />
                <DiffrenceSection />
            </div>
            <Footer />
        </>
    );
};

export default HomePage;
