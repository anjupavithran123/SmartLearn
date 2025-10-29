import React from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";

//  import Navbar from "./auth/layout/navbar";
//  import FeatureSection from "./auth/layout/FeatureSection";
//  import FactSection from "./auth/layout/FactSection";
//  import TestimonialSection from "./auth/layout/TestimonialSection";
// import Footer from "./auth/layout/Footer";
//  import AboutSection from "./auth/layout/about";

import Login from "./auth/login";
import Home from "./pages/Home";
import Signup from "./auth/signup";
import ProtectedRoute from "./auth/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import StudentDashboard from "./pages/studentdashboard";
import TutorDashboard from "./pages/tutordahboard";
import RoleRoute from "./auth/rolerouter";
import CourseDetails from "./pages/CourseDetails";
import Courses from "./pages/courses";
export default function App() {
  return (
   <BrowserRouter>
     
    {/* <div className="bg-gray-50 text-gray-800">
      <Navbar />
      <FeatureSection />
      <FactSection />
      <TestimonialSection />
      <AboutSection/>
      <Footer />
    </div> */}
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup/>}/>
        

        <Route
          path="/dashboard/*"           // allow nested routes inside Dashboard
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
  path="/dashboard/student"
  element={
    <RoleRoute allowedRoles="student">
      <StudentDashboard />
    </RoleRoute>
  }
/>

<Route
  path="/dashboard/tutor"
  element={
    <RoleRoute allowedRoles="tutor">
      <TutorDashboard />
    </RoleRoute>
  }
/>

<Route path="/courses/:id" element={<CourseDetails />} />
<Route path="/courses" element={<Courses/>} />


           </Routes>
      </BrowserRouter>
  );
}
