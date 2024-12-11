"use client";

import React from "react";
import { Ride } from "../components/Types/RideType";
import { useAuth } from "@clerk/nextjs";

// API key for GeoAPI
const apiKey = "5312629079c24b608f9ca2bcaa5fce0b";

interface RideCardProps {
  ride: Ride;
  handleAddToRide?: (rideId: string) => void;
  addToRide?: Boolean;
}

const RideCard: React.FC<RideCardProps> = ({
  ride,
  handleAddToRide,
  addToRide,
}) => {
  const { startLocation, destinationLocation, rideId, status } = ride;
  const { userId } = useAuth();
  if (ride.passengers.some((passenger) => passenger.clerkId != userId)) return;
  if (
    !startLocation ||
    !startLocation.coordinates ||
    !destinationLocation ||
    !destinationLocation.coordinates
  ) {
    return <p>Error: Invalid ride data</p>;
  }

  const [originLongitude, originLatitude] = startLocation.coordinates;
  const [destinationLongitude, destinationLatitude] =
    destinationLocation.coordinates;

  // Calculate the bounding box (bbox) for origin and destination
  const minLongitude = Math.min(originLongitude, destinationLongitude);
  const minLatitude = Math.min(originLatitude, destinationLatitude);
  const maxLongitude = Math.max(originLongitude, destinationLongitude);
  const maxLatitude = Math.max(originLatitude, destinationLatitude);

  // Construct Geoapify URL with bbox
  const geoApiUrl = `https://maps.geoapify.com/v1/staticmap?style=osm-bright-smooth&width=600&height=400&bbox=${minLongitude},${minLatitude},${maxLongitude},${maxLatitude}&apiKey=${apiKey}&path=color:blue|weight:3|opacity:0.8|${originLongitude},${originLatitude}|${destinationLongitude},${destinationLatitude}&marker=lonlat:${originLongitude},${originLatitude};type:awesome;color:green|lonlat:${destinationLongitude},${destinationLatitude};type:awesome;color:red`;

  return (
    <li className="p-6 border border-gray-700 rounded-lg bg-gray-900 shadow-lg flex flex-col md:flex-row gap-6 transition-transform transform hover:scale-105 duration-300">
      <div className="w-full md:w-1/2 relative">
        <img
          src={geoApiUrl}
          alt="Ride Location Map"
          className="w-full h-48 md:h-64 object-cover rounded-lg shadow-md"
        />
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white text-sm px-3 py-1 rounded-md shadow-md">
          Map Preview
        </div>
      </div>
      <div className="w-full md:w-1/2 flex flex-col justify-center">
        <div>
          <p className="text-yellow-500 text-sm font-bold uppercase">
            Ride Details
          </p>
          <p className="mt-2 text-white text-base md:text-lg">
            <strong className="text-gray-400">Origin:</strong> {ride.origin}
          </p>
          <p className="mt-1 text-white text-base md:text-lg">
            <strong className="text-gray-400">Destination:</strong>{" "}
            {ride.destination}
          </p>
          <p className="mt-1 text-white text-base md:text-lg">
            <strong className="text-gray-400">Start Time:</strong>{" "}
            {new Date(ride.startTime).toLocaleString()}
          </p>
          <p className="mt-1 text-white text-base md:text-lg">
            <strong className="text-gray-400">Status:</strong>{" "}
            <span className="capitalize">{status}</span>
          </p>
        </div>

        {addToRide && (
          <button
            onClick={() => handleAddToRide(rideId)}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105 mt-4"
          >
            Add me to Ride
          </button>
        )}

        <a
          href={
            status === "completed" ? undefined : `/rides/updateride/${rideId}`
          }
          className={`py-2 px-4 rounded-lg shadow-md font-bold transition-transform transform mt-4 ${
            status === "completed"
              ? "bg-gray-500 cursor-not-allowed text-white"
              : "bg-yellow-500 hover:bg-yellow-600 text-black hover:scale-105"
          }`}
          aria-disabled={status === "completed"}
          onClick={(e) => {
            if (status === "completed") {
              e.preventDefault();
              alert("Ride with status 'Completed' cannot be updated.");
            }
          }}
        >
          Update Ride
        </a>
      </div>
    </li>
  );
};

export default RideCard;
