import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./auth/layout/navbar";
import FeatureSection from "./auth/layout/FeatureSection";
import FactSection from "./auth/layout/FactSection";
import TestimonialSection from "./auth/layout/TestimonialSection";
import Footer from "./auth/layout/Footer";
import AboutSection from "./auth/layout/about";
import Login from "./auth/login";
import Home from "./pages/Home";
import Signup from "./auth/signup";
import ProtectedRoute from "./auth/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
export default function App() {
  return (
    <>
     
    <div className="bg-gray-50 text-gray-800">
      <Navbar />
      <FeatureSection />
      <FactSection />
      <TestimonialSection />
      <AboutSection/>
      <Footer />
    </div>
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/dashboard" element={  <Dashboard /> } />
      </Routes>
      </>
  );
}
