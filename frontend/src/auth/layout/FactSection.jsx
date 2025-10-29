import React from "react";

export default function FactSection() {
  const facts = [
    { img: "/img/icon-4.png", title: "Qualified Team" },
    { img: "/img/icon-1.png", title: "Individual Approach" },
    { img: "/img/icon-8.png", title: "100% Success" },
    { img: "/img/icon-6.png", title: "100% Satisfaction" },
  ];

  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-6xl mx-auto px-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
        {facts.map((f) => (
          <div key={f.title} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
            <img src={f.img} alt={f.title} className="mx-auto mb-4 h-16" />
            <h2 className="text-xl font-semibold">{f.title}</h2>
          </div>
        ))}
      </div>
    </section>
  );
}
