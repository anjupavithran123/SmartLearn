import React from "react";
import Onlinelearn from "../../assets/onlinelearn.jpg";

export default function FeatureSection() {
  return (
    <section className="py-16 bg-white" id="features">
      <div className="max-w-8xl mx-auto px-8 grid md:grid-cols-2 gap-12 items-center">
        <img src={Onlinelearn} alt="Business Man" className="w-full rounded-lg" />
        <div>
          
          <h2 className="text-4xl font-bold mb-4">Learn With Us</h2>
          <p className="text-gray-600 mb-6">
          Online education is learning that happens over the internet using devices like computers
           and tablets, instead of in a physical classroom. Students can take classes, watch videos, 
           and interact with teachers and classmates from anywhere,
           at any time. It's a flexible way to learn, but it also requires self-discipline to stay on track.            </p>

          <div className="grid grid-cols-2 gap-6 text-center">
            {[
              { icon: "fa-user", num: 100, label: "Our Staffs" },
              { icon: "fa-users", num: 200, label: "Our Clients" },
              { icon: "fa-check", num: 300, label: "Completed Projects" },
              { icon: "fa-running", num: 400, label: "Running Projects" },
            ].map(({ icon, num, label }) => (
              <div key={label} className="bg-gray-100 p-4 rounded-lg shadow-sm">
                <i className={`fa ${icon} text-orange-500 text-3xl mb-2`} />
                <h2 className="text-2xl font-bold">{num}</h2>
                <p className="text-sm text-gray-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
