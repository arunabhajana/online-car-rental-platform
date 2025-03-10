import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ListingsPage from "./pages/ListingsPage";
import NewListingsPage from "./pages/NewListingsPage";
import HomePage from "./pages/HomePage";
import SuppliersPage from "./pages/SuppliersPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/suppliers" element={<SuppliersPage />} />
        <Route path="/listings" element={<ListingsPage />} />
        <Route path="/new-listing" element={<NewListingsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
      </Routes>
    </Router>
  );
}

export default App;
