// Main page for Rider functionality
// src/app/riders/page.tsx

"use client";

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

export default function RidersPage() {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [pickupTime, setPickupTime] = useState('now');
  const [forMe, setForMe] = useState(true);
  const [currentLocation, setCurrentLocation] = useState([51.505, -0.09]); // Default to London coordinates
  const [isLoading, setIsLoading] = useState(true);

  // Custom marker icon for Leaflet
  const customMarkerIcon = new L.Icon({
    iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-green.png',
    shadowUrl: 'https://leafletjs.com/examples/custom-icons/leaf-shadow.png',
    iconSize: [38, 95],
    shadowSize: [50, 64],
    iconAnchor: [22, 94],
    shadowAnchor: [4, 62],
    popupAnchor: [-3, -76],
  });

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
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
          <MapContainer center={currentLocation} zoom={13} className="w-full h-full">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
            />
            <Marker position={currentLocation} icon={customMarkerIcon}>
              <Popup>Your Current Location</Popup>
            </Marker>
          </MapContainer>
        ) : (
          <p className="text-center mt-6">Loading map...</p>
        )}
      </div>
    </div>
  );
}


