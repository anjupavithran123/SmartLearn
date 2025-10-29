// src/pages/Home.jsx
import React from "react";
import FeatureSection from "../auth/layout/FeatureSection";
import FactSection from "../auth/layout/FactSection";
import TestimonialSection from "../auth/layout/TestimonialSection";
import AboutSection from "../auth/layout/about";
import Footer from "../auth/layout/Footer";

export default function Home() {
  return (
    <div className="bg-gray-50 text-gray-800">
      <FeatureSection />
      <FactSection />
      <TestimonialSection />
      <AboutSection />
      <Footer />
    </div>
  );
}
