

const Footer = () => {

    return (
        <footer className="bg-gray-900 text-white py-10 text-center">
        <div className="container mx-auto">
          <p className="text-lg font-semibold">BookCars</p>
          <div className="flex justify-center gap-10 mt-4">
            <ul className="menu bg-base-200 rounded-box w-56" data-theme="dark">
              <li><a>About Us</a></li>
              <li><a>Cookie Policy</a></li>
              <li><a>Privacy Policy</a></li>
              <li><a>Terms of Service</a></li>
            </ul>
            <ul className="menu bg-base-200 rounded-box w-56" data-theme="dark">
              <li><a>Rent a Car</a></li>
              <li><a>Suppliers</a></li>
              <li><a>Locations</a></li>
              <li><a>Profile</a></li>
            </ul>
          </div>
          <p className="mt-6 font-semibold">100% secure payment with BookCars</p>
          <p className="mt-2">Copyright © 2025 BookCars. All rights reserved.</p>
        </div>
      </footer>
    );
}

export default Footer;