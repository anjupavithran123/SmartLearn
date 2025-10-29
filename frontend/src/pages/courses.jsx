import React, { useEffect, useState } from "react";

// ✅ Use the correct API base (adjust if using Vite)
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");

  // ✅ Helper function to fetch courses
  async function fetchCourses() {
    try {
      const res = await fetch(`${API_BASE}/api/courses`, {
        headers: { "Content-Type": "application/json" },
      });

      const ct = res.headers.get("content-type") || "";
      const text = await res.text();

      if (!res.ok) {
        const bodyPreview = text.slice(0, 100);
        throw new Error(
          `HTTP ${res.status} ${res.statusText} — response starts with: ${bodyPreview}`
        );
      }

      if (ct.includes("application/json")) {
        return JSON.parse(text);
      } else {
        const preview = text.slice(0, 200);
        throw new Error(
          `Expected JSON but got ${ct || "no content-type"}. Response preview: ${preview}`
        );
      }
    } catch (err) {
      console.error("fetchCourses error:", err);
      throw err;
    }
  }

  // ✅ Load courses when the component mounts
  useEffect(() => {
    fetchCourses()
      .then((data) => {
        console.log("Fetched courses:", data);
        setCourses(Array.isArray(data) ? data : data.data || []);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);

  // ✅ Render
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Courses</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {courses.length === 0 && !error && <p>Loading courses...</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <div
            key={course.id}
            className="border p-4 rounded shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold">{course.title}</h2>
            <p className="text-gray-600">{course.description}</p>

            <a
              href={`/courses/${course.id}`}
              className="mt-2 inline-block text-blue-600 hover:underline"
            >
              View Details
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
