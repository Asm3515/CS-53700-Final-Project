"use client"; // @ts-nocheck
import React, { useState } from "react";
import dynamic from "next/dynamic";
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
  // const hours = today.getHours().toString().padStart(2, "0");
  // const minutes = today.getMinutes().toString().padStart(2, "0");
  // const todayWithTime = `${todayDate}T${hours}:${minutes}`;
   const todayWithTime = todayDate + "T00:00"; 
  
  const { userId } = useAuth();
  const router = useRouter();

  const handleGeocode = async (location: string) => {
    try {
      const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          location
        )}.json?access_token=${mapboxToken}`
      );

      // Filtering loccations with usa as country
      const filteredUSASuggestions = response.data.features.filter((feature) => {
        return feature.context.some((context) => context.id.includes("country") && context.text === "United States");
      });

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

    // Only search if input is not empty
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

    // Only search if input is not empty
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
    setPickupSuggestions([]); // Clear suggestions after selection
  };

  const handleDropoffSelect = (suggestion) => {
    setDropoff(suggestion.placeName);
    setSelectedDropoffLocation(suggestion);
    setDropoffSuggestions([]); // Clear suggestions after selection
  };

  const handleSubmit = async () => {
    try {
      // Validate that locations are selected
      if (!selectedPickupLocation || !selectedDropoffLocation || !dateTime) {
        alert("Please select pickup and dropoff locations and choose a date and time.");
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

      console.log("Ride Request:", rideRequest);
      const backendUrl = "/api/rides";
      await axios.post(backendUrl, rideRequest);
      alert("Ride created successfully!");
      router.push("/passenger/dashboard");
    } catch (error) {
      console.error("Error creating ride:", error);
      alert("Failed to create the ride. Please try again.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-8 bg-black text-white gap-6">
      <div className="w-full max-w-lg mx-auto bg-gray-800 text-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Find a Ride</h2>
        
        <div className="mb-6">
          <label className="block text-gray-300 mb-2">Pick-up Location</label>
          <input
            type="text"
            value={pickup}
            onChange={handlePickupChange}
            placeholder="Enter pick-up location"
            className="w-full p-3 rounded-md border border-gray-600 bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          {pickupSuggestions.length > 0 && (
            <div className="bg-gray-700 rounded-md mt-1">
              {pickupSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  onClick={() => handlePickupSelect(suggestion)}
                  className="p-2 hover:bg-gray-600 cursor-pointer"
                >
                  {suggestion.placeName}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-300 mb-2">Drop-off Location</label>
          <input
            type="text"
            value={dropoff}
            onChange={handleDropoffChange}
            placeholder="Enter drop-off location"
            className="w-full p-3 rounded-md border border-gray-600 bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          {dropoffSuggestions.length > 0 && (
            <div className="bg-gray-700 rounded-md mt-1">
              {dropoffSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  onClick={() => handleDropoffSelect(suggestion)}
                  className="p-2 hover:bg-gray-600 cursor-pointer"
                >
                  {suggestion.placeName}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-300 mb-2">Date and Time</label>
          <input
            type="datetime-local"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            min={todayWithTime} 
            className="w-full p-3 rounded-md border border-gray-600 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>
        
        <button
          onClick={handleSubmit}
          className="w-full py-3 bg-yellow-500 text-black font-bold rounded-md shadow-md hover:bg-yellow-600 transition duration-300"
        >
          Create Ride
        </button>
      </div>
    </div>
  );
}
