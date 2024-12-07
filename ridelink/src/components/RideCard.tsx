"use client"

import React from "react";
import { useRouter } from "next/navigation";
import {Ride} from "../components/Types/RideType"

// API key for GeoAPI
const apiKey = "5312629079c24b608f9ca2bcaa5fce0b"; 

interface RideCardProps {
  ride: Ride;
  handleDeleteRide: (rideId: string, passengers: string[]) => void;
}

const RideCard: React.FC<RideCardProps> = ({ ride, handleDeleteRide }) => {
  const router = useRouter(); // Initialize router

  const { destinationLocation } = ride;
  if (!destinationLocation || !destinationLocation.coordinates) {
    return <p>Error: Invalid ride data</p>;
  }

  const [destinationLongitude, destinationLatitude] = destinationLocation.coordinates;

  // Construct GeoAPI URL dynamically
  const geoApiUrl = `https://maps.geoapify.com/v1/staticmap?style=osm-bright-smooth&width=600&height=400&center=lonlat:${destinationLongitude},${destinationLatitude}&zoom=14&apiKey=${apiKey}`;

  // Function to navigate to the update ride page
  const navigateToUpdateRide = (rideId: string) => {
    router.push(`/ride/updateride/${rideId}`);
  };

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
        

        <div className="flex space-x-4 mt-4">
          {/* Update ride button */}
          <button
            onClick={() => navigateToUpdateRide(ride.rideId)}
            className="bg-blue-500 p-2 rounded-md"
          >
            Update
          </button>

          {/* Delete or remove passenger */}
          <button
                  onClick={() =>
                    handleDeleteRide(ride.rideId, ride.passengers.map(passenger => passenger.clerkId)) // Extract clerkId
                  }
                  className="bg-red-500 p-2 rounded-md"
                >
                  {ride.passengers.length === 0 ? "Delete Ride" : "Remove from Ride"}
                </button>
        </div>
      </div>
    </li>
  );
};

export default RideCard;
