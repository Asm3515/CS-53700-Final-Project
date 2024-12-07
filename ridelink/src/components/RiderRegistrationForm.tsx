"use client";
import { useState } from "react";
import axios from "axios";

const RiderRegistrationForm = () => {
  const [formData, setFormData] = useState({
    clerkId: "",
    vehicleDetails: { make: "", model: "", year: "", licensePlate: "" },
    availability: [],
    status: "Inactive",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVehicleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      vehicleDetails: { ...prev.vehicleDetails, [name]: value },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/rider/register", formData);
      alert("Rider registered successfully!");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Axios-specific error handling
        alert("Failed to register rider: " + (error.response?.data?.message || error.message));
      } else if (error instanceof Error) {
        // Generic error handling
        alert("Failed to register rider: " + error.message);
      } else {
        alert("An unknown error occurred.");
      }
    }
  };
  

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Rider Registration</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="clerkId" className="block text-sm font-medium">
            Clerk ID
          </label>
          <input
            type="text"
            id="clerkId"
            name="clerkId"
            value={formData.clerkId}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md"
          />
        </div>
        <h3 className="text-md font-semibold mb-2">Vehicle Details</h3>
        <div className="mb-4">
          <label htmlFor="make" className="block text-sm font-medium">
            Make
          </label>
          <input
            type="text"
            id="make"
            name="make"
            value={formData.vehicleDetails.make}
            onChange={handleVehicleChange}
            required
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="model" className="block text-sm font-medium">
            Model
          </label>
          <input
            type="text"
            id="model"
            name="model"
            value={formData.vehicleDetails.model}
            onChange={handleVehicleChange}
            required
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="year" className="block text-sm font-medium">
            Year
          </label>
          <input
            type="number"
            id="year"
            name="year"
            value={formData.vehicleDetails.year}
            onChange={handleVehicleChange}
            required
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="licensePlate" className="block text-sm font-medium">
            License Plate
          </label>
          <input
            type="text"
            id="licensePlate"
            name="licensePlate"
            value={formData.vehicleDetails.licensePlate}
            onChange={handleVehicleChange}
            required
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="availability" className="block text-sm font-medium">
            Availability (comma-separated days)
          </label>
          <input
            type="text"
            id="availability"
            name="availability"
            value={formData.availability}
            onChange={handleChange}
            placeholder="e.g., Monday,Wednesday,Friday"
            required
            className="w-full p-2 border rounded-md"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default RiderRegistrationForm;
