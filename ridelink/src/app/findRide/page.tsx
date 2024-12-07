// // Main page for Rider functionality
// // src/app/findRide/page.tsx
"use client";
 
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
 
// Dynamically import `MapContainer`, `TileLayer`, and `Marker` to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);
const L = typeof window !== "undefined" ? require("leaflet") : null;
 
export default function FindRidePage() {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [pickupSuggestions, setPickupSuggestions] = useState<string[]>([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState<string[]>([]);
  const [pickupTime, setPickupTime] = useState("now");
  const [forMe, setForMe] = useState(true);
  const [currentLocation, setCurrentLocation] = useState<[number, number]>([
    51.505,
    -0.09,
  ]); // Default coordinates
  const [isLoading, setIsLoading] = useState(true);
 
  useEffect(() => {
    if (typeof window !== "undefined" && L) {
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
iconUrl: "https://leafletjs.com/examples/custom-icons/leaf-green.png",
shadowUrl: "https://leafletjs.com/examples/custom-icons/leaf-shadow.png",
      });
    }
  }, []);
 
  useEffect(() => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation([
            position.coords.latitude,
            position.coords.longitude,
          ]);
          setIsLoading(false);
        },
        (error) => {
          console.error("Error getting location: ", error);
          setIsLoading(false);
        }
      );
    }
  }, []);
 
  const fetchSuggestions = async (
    query: string,
    setSuggestions: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (query.length < 3) return; // Only fetch if query is 3+ characters
 
const url = `https://google-map-places.p.rapidapi.com/maps/api/geocode/json?address=${encodeURIComponent(
      query
    )}&language=en&region=en&result_type=administrative_area_level_1&location_type=APPROXIMATE`;
    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": "d012f44196mshbe16abb2690335bp1006f5jsn29cf33b975e9",
"x-rapidapi-host": "google-map-places.p.rapidapi.com",
      },
    };
 
    try {
      const response = await fetch(url, options);
      const result = await response.json();
      const suggestions = result.results.map((res: any) => res.formatted_address);
      setSuggestions(suggestions);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };
 
  const handlePickupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPickup(value);
    fetchSuggestions(value, setPickupSuggestions);
  };
 
  const handleDropoffChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDropoff(value);
    fetchSuggestions(value, setDropoffSuggestions);
  };
 
  const handleSelectPickup = (location: string) => {
    setPickup(location);
    setPickupSuggestions([]);
  };
 
  const handleSelectDropoff = (location: string) => {
    setDropoff(location);
    setDropoffSuggestions([]);
  };
 
  return (
    // <div className="flex flex-col md:flex-row min-h-screen p-4 md:p-8 bg-gray-100 gap-6">
    <div
    className="flex flex-col md:flex-row min-h-screen p-4 md:p-8 bg-gray-100 gap-6 relative"
    style={{
backgroundImage: "url('https://source.unsplash.com/1600x900/?city,travel')",
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    <div className="absolute inset-0 bg-black opacity-30 z-0" />
    <div className="z-10 flex flex-col md:flex-row gap-6 w-full">
      {/* Left Side: Form for Ride Details */}
      <div className="w-full md:w-1/3 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Find a trip</h2>
        {/* Pickup Location */}
        <div className="mb-4 relative">
          <label className="block text-gray-700 mb-2">Pick-up location</label>
          <input
            type="text"
            placeholder="Enter pick-up location"
            value={pickup}
            onChange={handlePickupChange}
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          {pickupSuggestions.length > 0 && (
            <ul className="absolute bg-white border border-gray-300 w-full mt-1 rounded-lg shadow-lg z-10">
              {pickupSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSelectPickup(suggestion)}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Drop-off Location */}
        <div className="mb-4 relative">
          <label className="block text-gray-700 mb-2">Drop-off location</label>
          <input
            type="text"
            placeholder="Enter drop-off location"
            value={dropoff}
            onChange={handleDropoffChange}
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          {dropoffSuggestions.length > 0 && (
            <ul className="absolute bg-white border border-gray-300 w-full mt-1 rounded-lg shadow-lg z-10">
              {dropoffSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSelectDropoff(suggestion)}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
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
        <button className="w-full py-3 mt-4 bg-yellow-500 text-black font-bold rounded-lg shadow-lg hover:bg-yellow-600 transition">
          Search
        </button>
      </div>
      {/* Right Side: Map Display */}
      <div className="w-full md:w-2/3 h-96 md:h-full rounded-lg shadow-lg overflow-hidden">
        {!isLoading ? (
          <MapContainer center={currentLocation} zoom={13} className="w-full h-full">
            <TileLayer
url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
attribution="© https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
            />
            <Marker position={currentLocation}>
              <Popup>Your Current Location</Popup>
            </Marker>
          </MapContainer>
        ) : (
          <p className="text-center mt-6">Loading map...</p>
        )}
      </div>
    </div>
    </div>
  );
}