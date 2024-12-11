"use client"; // @ts-nocheck
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

export default function FindRidePage() {
  const [pickup, setPickup] = useState("");
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [selectedPickupLocation, setSelectedPickupLocation] = useState(null);

  const [dropoff, setDropoff] = useState("");
  const [dropoffSuggestions, setDropoffSuggestions] = useState([]);
  const [selectedDropoffLocation, setSelectedDropoffLocation] = useState(null);

  const [dateTime, setDateTime] = useState("");

  const today = new Date();
  const todayDate = today.toISOString().split("T")[0];
  const todayWithTime = `${todayDate}T00:00`;

  const { userId } = useAuth();
  const router = useRouter();

  const handleGeocode = async (location) => {
    try {
      const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          location
        )}.json?access_token=${mapboxToken}`
      );

      const filteredUSASuggestions = response.data.features.filter((feature) =>
        feature.context.some(
          (context) =>
            context.id.includes("country") && context.text === "United States"
        )
      );

      return filteredUSASuggestions.map((feature) => ({
        coordinates: feature.center,
        placeName: feature.place_name,
      }));
    } catch (error) {
      console.error("Geocoding error:", error);
      return [];
    }
  };

  const handlePickupChange = async (e) => {
    const inputValue = e.target.value;
    setPickup(inputValue);
    if (inputValue.trim()) {
      const suggestions = await handleGeocode(inputValue);
      setPickupSuggestions(suggestions);
    } else {
      setPickupSuggestions([]);
    }
  };

  const handleDropoffChange = async (e) => {
    const inputValue = e.target.value;
    setDropoff(inputValue);
    if (inputValue.trim()) {
      const suggestions = await handleGeocode(inputValue);
      setDropoffSuggestions(suggestions);
    } else {
      setDropoffSuggestions([]);
    }
  };

  const handlePickupSelect = (suggestion) => {
    setPickup(suggestion.placeName);
    setSelectedPickupLocation(suggestion);
    setPickupSuggestions([]);
  };

  const handleDropoffSelect = (suggestion) => {
    setDropoff(suggestion.placeName);
    setSelectedDropoffLocation(suggestion);
    setDropoffSuggestions([]);
  };

  const handleSubmit = async () => {
    try {
      if (!selectedPickupLocation || !selectedDropoffLocation || !dateTime) {
        alert(
          "Please select pickup and dropoff locations and choose a date and time."
        );
        return;
      }

      const rideRequest = {
        createdBy: "passenger",
        passengers: [
          {
            clerkId: userId,
            pickupLocation: selectedPickupLocation.placeName,
            dropoffLocation: selectedDropoffLocation.placeName,
            pickupCoordinates: selectedPickupLocation.coordinates,
            dropoffCoordinates: selectedDropoffLocation.coordinates,
          },
        ],
        startTime: new Date(dateTime).toISOString(),
        origin: selectedPickupLocation.placeName,
        destination: selectedDropoffLocation.placeName,
        startLocation: {
          type: "Point",
          coordinates: selectedPickupLocation.coordinates,
        },
        destinationLocation: {
          type: "Point",
          coordinates: selectedDropoffLocation.coordinates,
        },
      };

      const backendUrl = "/api/rides";
      await axios.post(backendUrl, rideRequest);
      alert("Ride created successfully!");
      router.push("/passenger/dashboard");
    } catch (error) {
      console.error("Error creating ride:", error);
      alert("Failed to create the ride. Please try again.");
    }
  };

  const handleBackToDashboard = () => {
    router.push("/passenger/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white p-6">
      <button
        onClick={handleBackToDashboard}
        className="text-yellow-500 hover:text-yellow-600 font-bold px-6 py-2 mb-6 rounded-md shadow-lg bg-gray-800 hover:bg-gray-700 transition-transform transform hover:scale-105 w-40"
      >
        Back to Dashboard
      </button>

      <div className="w-full max-w-2xl mx-auto bg-gray-800 rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-yellow-400 text-center mb-6">
          Find a Ride
        </h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Pickup Location
            </label>
            <input
              type="text"
              value={pickup}
              onChange={handlePickupChange}
              placeholder="Enter pickup location"
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            {pickupSuggestions.length > 0 && (
              <div className="bg-gray-700 rounded-md mt-2 shadow-md">
                {pickupSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => handlePickupSelect(suggestion)}
                    className="px-4 py-2 hover:bg-gray-600 cursor-pointer"
                  >
                    {suggestion.placeName}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Dropoff Location
            </label>
            <input
              type="text"
              value={dropoff}
              onChange={handleDropoffChange}
              placeholder="Enter dropoff location"
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            {dropoffSuggestions.length > 0 && (
              <div className="bg-gray-700 rounded-md mt-2 shadow-md">
                {dropoffSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => handleDropoffSelect(suggestion)}
                    className="px-4 py-2 hover:bg-gray-600 cursor-pointer"
                  >
                    {suggestion.placeName}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Date and Time
            </label>
            <input
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              min={todayWithTime}
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-yellow-500 text-black font-bold px-6 py-3 rounded-md shadow-md hover:bg-yellow-600 transition-transform transform hover:scale-105"
          >
            Create Ride
          </button>
        </div>
      </div>
    </div>
  );
}
