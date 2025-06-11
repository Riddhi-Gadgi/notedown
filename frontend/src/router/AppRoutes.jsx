// AppRoutes.js
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";
import ProductSection from "../components/landing/ProductSection";
import PricingSection from "../components/landing/PricingSection";
import KnowMoreSection from "../components/landing/KnowMoreSection";
import "../../src/index.css";
import Navbar from "../components/landing/Navbar";
import SolutionsSection from "../components/SolutionsSection";
import HeroSection from "../components/landing/HeroSection";
import Footer from "../components/Footer";
import Dashboard from "../components/dashboard/pages/Dashboard";
const AppRoutes = () => (
  <Routes>
    {/* Landing Page */}
    <Route
      path="/"
      element={
        <div className="min-h-screen bg-white">
          <Navbar />
          <HeroSection />
          <ProductSection />
          <SolutionsSection />
          <PricingSection />
          <KnowMoreSection />
          <Footer />
        </div>
      }
    />

    {/* Auth Pages */}
    <Route path="/signup" element={<Signup />} />
    <Route path="/login" element={<Login />} />

    {/* Dashboard */}
    <Route path="/dashboard/*" element={<Dashboard />} />

    {/* Redirect old app routes */}
    <Route path="/app/*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);

export default AppRoutes;
