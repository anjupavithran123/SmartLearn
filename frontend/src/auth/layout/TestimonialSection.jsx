import React from "react";

export default function TestimonialSection() {
  const testimonials = [
    {
      img: "/img/testimonial-1.jpg",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      name: "Client Name",
      role: "Profession",
    },
    {
      img: "/img/testimonial-2.jpg",
      text: "Phasellus pellentesque tempus pretium. Quisque in enim sit amet purus.",
      name: "Client Name",
      role: "Profession",
    },
    {
      img: "/img/testimonial-3.jpg",
      text: "Sed in lectus eu eros tincidunt cursus.",
      name: "Client Name",
      role: "Profession",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <p className="text-orange-500 uppercase font-semibold">Testimonial Carousel</p>
        <h2 className="text-4xl font-bold mb-10">100% Positive Customer Reviews</h2>

        <div className="grid gap-8 md:grid-cols-3">
  {testimonials.map((t, idx) => (
    <div 
      key={`${t.name}-${idx}`} 
      className="bg-gray-100 p-6 rounded-lg shadow hover:shadow-lg transition"
    >
      <img 
        src={t.img} 
        alt={t.name} 
        className="w-20 h-20 mx-auto rounded-full mb-4" 
      />
      <p className="text-gray-600 mb-4">{t.text}</p>
      <h3 className="font-bold">{t.name}</h3>
      <p className="text-sm text-gray-500">{t.role}</p>
    </div>
  ))}
</div>

      </div>
    </section>
  );
}
