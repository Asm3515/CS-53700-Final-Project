"use client"

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import 'mapbox-gl/dist/mapbox-gl.css';

// Dynamically import the Map component to avoid SSR issues
const Map = dynamic(() => import('react-map-gl').then((mod) => mod.Map), { ssr: false });

export default function FindRidePage() {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [pickupTime, setPickupTime] = useState('now');
  const [forMe, setForMe] = useState(true);
  const [currentLocation, setCurrentLocation] = useState<[number, number]>([51.505, -0.09]); // Default coordinates
  const [isLoading, setIsLoading] = useState(true);
  const [geocodeResult, setGeocodeResult] = useState(null); // Store geocode result

  const MAPBOX_ACCESS_TOKEN = 'YOUR_MAPBOX_ACCESS_TOKEN'; // Add your Mapbox access token here

  // Fetch geocode information from Mapbox when pickup location is set
  const fetchGeocode = async (location: string) => {
    try {
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json`,
        {
          params: {
            access_token: MAPBOX_ACCESS_TOKEN
          }
        }
      );
      console.log(response.data);
      setGeocodeResult(response.data);
    } catch (error) {
      console.error('Error fetching geocode:', error);
    }
  };

  // Get user's current location only on the client side
  useEffect(() => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation([position.coords.latitude, position.coords.longitude]);
          setIsLoading(false);
        },
        (error) => {
          console.error("Error getting location: ", error);
          setIsLoading(false);
        }
      );
    }
  }, []);

  // Fetch geocode for pickup location when it changes
  useEffect(() => {
    if (pickup) {
      fetchGeocode(pickup);
    }
  }, [pickup]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen p-4 md:p-8 bg-gray-100 gap-6">
      {/* Left Side: Form for Ride Details */}
      <div className="w-full md:w-1/3 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Find a trip</h2>

        {/* Pickup Location */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Pick-up location</label>
          <input
            type="text"
            placeholder="Enter pick-up location"
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        {/* Drop-off Location */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Drop-off location</label>
          <input
            type="text"
            placeholder="Enter drop-off location"
            value={dropoff}
            onChange={(e) => setDropoff(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        {/* Pickup Time */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Pick up</label>
          <select
            value={pickupTime}
            onChange={(e) => setPickupTime(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="now">Pick up now</option>
            <option value="later">Pick up later</option>
          </select>
        </div>

        {/* For Me Toggle */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Passenger</label>
          <select
            value={forMe ? "For me" : "For someone else"}
            onChange={() => setForMe(!forMe)}
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="me">For me</option>
            <option value="someone-else">For someone else</option>
          </select>
        </div>

        {/* Search Button */}
        <button
          className="w-full py-3 mt-4 bg-yellow-500 text-black font-bold rounded-lg shadow-lg hover:bg-yellow-600 transition"
        >
          Search
        </button>
      </div>

      {/* Right Side: Map Display */}
      <div className="w-full md:w-2/3 h-96 md:h-full rounded-lg shadow-lg overflow-hidden">
        {!isLoading ? (
          <Map
            latitude={currentLocation[0]}
            longitude={currentLocation[1]}
            zoom={13}
            mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
            style={{ width: '100%', height: '100%' }} // Use CSS for width/height
          />
        ) : (
          <p className="text-center mt-6">Loading map...</p>
        )}
      </div>
    </div>
  );
}
