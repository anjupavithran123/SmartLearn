import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
        <div>
          <h2 className="text-xl font-bold mb-4 text-orange-500">Our Head Office</h2>
          <p><i className="fa fa-map-marker-alt mr-2"></i>123 Street, New York, USA</p>
          <p><i className="fa fa-phone-alt mr-2"></i>+012 345 67890</p>
          <p><i className="fa fa-envelope mr-2"></i>info@example.com</p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4 text-orange-500">Quick Links</h2>
          <ul className="space-y-2">
            {["Terms of Use", "Privacy Policy", "Cookies", "Help", "FAQs"].map((link) => (
              <li key={link}><a href="#" className="hover:text-white">{link}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4 text-orange-500">Newsletter</h2>
          <p className="mb-4">Subscribe for updates and offers.</p>
          <div className="flex">
            <input type="email" placeholder="Email" className="flex-grow p-2 rounded-l bg-gray-800 border border-gray-700" />
            <button className="bg-orange-500 px-4 rounded-r text-black font-semibold">Submit</button>
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500 mt-8 border-t border-gray-700 pt-4">
       copy©2025 Smart_Learn 
      </div>
    </footer>
  );
}
