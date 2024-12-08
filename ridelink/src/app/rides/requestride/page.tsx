"use client";
// @ts-nocheck
import React, { useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import { useRouter } from "next/navigation";

// Dynamically import AddressAutofill with correct types

const AddressAutofill = dynamic(
  () => import("@mapbox/search-js-react").then((mod) => mod.AddressAutofill),
  {
    ssr: false, // Disable SSR for client-side only component
    loading: () => <div>Loading...</div>, // Optional: Show loading state while loading the component
  }
);

export default function FindRidePage() {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [pickupCoordinates, setPickupCoordinates] = useState<[number, number]>();
  const [dropoffCoordinates, setDropoffCoordinates] = useState<[number, number]>();
  const [dateTime, setDateTime] = useState("");
  const router = useRouter();

  const handleGeocode = async (location: string) => {
    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    const response = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        location
      )}.json?access_token=${mapboxToken}`
    );
    const [longitude, latitude] = response.data.features[0].center;
    const placeName = response.data.features[0].place_name;
    return { coordinates: [longitude, latitude], placeName };
  };

  const handleSubmit = async () => {
    try {
      if (!pickup || !dropoff || !dateTime) {
        alert("Please fill in all fields.");
        return;
      }

      const pickupData = await handleGeocode(pickup);
      const dropoffData = await handleGeocode(dropoff);

      const rideRequest = {
        createdBy: "passenger",
        passengers: [
          {
            clerkId: "user_2pgpECsPw29YylvQQ95A97h5MK9", // Example user
            pickupLocation: pickupData.placeName,
            dropoffLocation: dropoffData.placeName,
            pickupCoordinates: pickupData.coordinates,
            dropoffCoordinates: dropoffData.coordinates,
          },
        ],
        startTime: new Date(dateTime).toISOString(),
        origin: pickupData.placeName,
        destination: dropoffData.placeName,
        startLocation: {
          type: "Point",
          coordinates: pickupData.coordinates,
        },
        destinationLocation: {
          type: "Point",
          coordinates: dropoffData.coordinates,
        },
      };

      console.log("Ride Request:", rideRequest);

      const backendUrl = "/api/rides"; // Replace with your API endpoint
      await axios.post(backendUrl, rideRequest);

      alert("Ride created successfully!");
      router.push("http://localhost:3000/passenger/dashboard");
    } catch (error) {
      console.error("Error creating ride:", error);
      alert("Failed to create the ride. Please try again.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-8 bg-gray-100 gap-6">
      <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Find a Ride</h2>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Pick-up Location</label>
          <AddressAutofill accessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN!}>
            <input
              type="text"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              placeholder="Enter pick-up location"
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </AddressAutofill>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Drop-off Location</label>
          <AddressAutofill accessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN!}>
            <input
              type="text"
              value={dropoff}
              onChange={(e) => setDropoff(e.target.value)}
              placeholder="Enter drop-off location"
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </AddressAutofill>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Date and Time</label>
          <input
            type="datetime-local"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-3 bg-yellow-500 text-black font-bold rounded-lg shadow-lg hover:bg-yellow-600 transition"
        >
          Create Ride
        </button>
      </div>
    </div>
  );
}
