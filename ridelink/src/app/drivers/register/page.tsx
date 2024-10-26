"use client";
 
import { useState } from "react";
import Image from "next/image";
 
export default function DriverRegister() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    licenseNumber: "",
    password: "",
  });
  const [isRegistered, setIsRegistered] = useState(false);
 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
 
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Driver registered:", formData);
 

    setIsRegistered(true);
 

    setFormData({
      name: "",
      email: "",
      phone: "",
      licenseNumber: "",
      password: "",
    });
  };
 
  return (
<div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
<div className="w-full max-w-md p-8 space-y-6 bg-white shadow-2xl rounded-lg">
<div className="flex justify-center">
<Image
            src="/ridelink_logo.png" 
            alt="Ridelink Logo"
            width={120}
            height={120}
            className="mb-4 rounded-full"
          />
</div>
 
        <h2 className="text-2xl font-semibold text-center text-gray-800">Driver Registration</h2>
 
        {/* Success Message */}
        {isRegistered && (
<p className="text-green-600 text-center font-medium">Driver registered successfully!</p>
        )}
 
        <form onSubmit={handleSubmit} className="space-y-4">
<div>
<label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="name">Full Name</label>
<input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter full name"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
</div>
<div>
<label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="email">Email Address</label>
<input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
</div>
<div>
<label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="phone">Phone Number</label>
<input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
</div>
<div>
<label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="licenseNumber">License Number</label>
<input
              type="text"
              id="licenseNumber"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleChange}
              placeholder="Enter license number"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
</div>
<div>
<label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="password">Password</label>
<input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
</div>
<button
            type="submit"
            className="w-full py-3 mt-6 font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-4 focus:ring-purple-300"
>
            Register
</button>
</form>
</div>
</div>
  );
}