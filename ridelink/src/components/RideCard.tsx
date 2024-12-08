"use client";

import React from "react";
import { Ride } from "../components/Types/RideType";

// API key for GeoAPI
const apiKey = "5312629079c24b608f9ca2bcaa5fce0b"; 

interface RideCardProps {
  ride: Ride;
}

const RideCard: React.FC<RideCardProps> = ({ ride }) => {
  const { destinationLocation } = ride;

  if (!destinationLocation || !destinationLocation.coordinates) {
    return <p>Error: Invalid ride data</p>;
  }

  const [destinationLongitude, destinationLatitude] = destinationLocation.coordinates;

  // Construct GeoAPI URL dynamically
  const geoApiUrl = `https://maps.geoapify.com/v1/staticmap?style=osm-bright-smooth&width=600&height=400&center=lonlat:${destinationLongitude},${destinationLatitude}&zoom=14&apiKey=${apiKey}`;

  return (
    <li className="p-4 border rounded-md bg-gray-800 shadow-sm flex">
      {/* Map on the left side */}
      <div className="w-1/2 pr-4">
        <img
          src={geoApiUrl}
          alt="Ride Location Map"
          className="w-full h-64 object-cover rounded-md"
        />
      </div>

      {/* Ride details on the right side */}
      <div className="w-1/2">
        <p>
          <strong>Origin:</strong> {ride.origin}
        </p>
        <p>
          <strong>Destination:</strong> {ride.destination}
        </p>
        <p>
          <strong>Start Time:</strong> {new Date(ride.startTime).toLocaleString()}
        </p>
      </div>
    </li>
  );
};

export default RideCard;
