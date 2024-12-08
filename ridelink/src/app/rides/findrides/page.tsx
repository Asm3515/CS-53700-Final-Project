"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Ride } from "../../../components/Types/RideType";
import { useAuth } from "@clerk/nextjs"; // Clerk authentication hook

const ridesApiUrl = "/api/rides"; // API endpoint to fetch all rides

const AllRidesPage: React.FC = () => {
  const { userId } = useAuth(); // Get the authenticated user from Clerk
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch all rides when the component mounts
  useEffect(() => {
    const fetchRides = async () => {
      console.log("Fetching rides..."); // Log before API call
      try {
        const response = await fetch(ridesApiUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch rides");
        }
        const data = await response.json();
        console.log("Fetched rides data:", data); // Log the fetched data
        setRides(data); // Assuming the response is an array of rides
      } catch (err) {
        console.error("Error fetching rides:", err); // Log the error if fetch fails
        setError("Error fetching rides. Please try again later.");
      } finally {
        setLoading(false);
        console.log("Finished loading rides data"); // Log when loading is complete
      }
    };

    fetchRides();
  }, []);

  // Show loading state or error if necessary
  if (loading) {
    console.log("Loading rides..."); // Log while loading
    return <p>Loading rides...</p>;
  }

  if (error) {
    console.log("Error state:", error); // Log error if there's one
    return <p>{error}</p>;
  }

  const clerkID = userId; // This is the Clerk User ID (clerkID)
  console.log("Authenticated Clerk ID:", clerkID); // Log the Clerk ID for debugging

  const handleAddToRide = async (rideId: string) => {
    console.log(`Adding user ${clerkID} to ride ${rideId}`); // Log when adding user to ride
    try {
      // Find the ride with the given ID
      const rideToUpdate = rides.find((ride) => ride.rideId === rideId);
      if (!rideToUpdate) {
        console.error(`Ride with ID ${rideId} not found`); // Log if ride not found
        return;
      }

      const updatedRide = {
        passengers: [...rideToUpdate.passengers, { clerkId: clerkID }],
        origin: rideToUpdate.origin,
        destination: rideToUpdate.destination,
      };

      const response = await fetch(`${ridesApiUrl}?rideId=${rideId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedRide),
      });

      if (!response.ok) {
        throw new Error("Failed to add to ride");
      }

      console.log("Successfully added user to ride"); // Log success
      // Optionally, you could redirect the user or update the UI
      setRides((prevRides) =>
        prevRides.map((ride) =>
          ride.rideId === rideId ? { ...ride, passengers: updatedRide.passengers } : ride
        )
      );
    } catch (err) {
      console.error("Error adding user to ride:", err); // Log error if PATCH request fails
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">All Rides</h1>
      <ul className="space-y-4">
        {rides.map((ride) => {
          const { destinationLocation, origin, destination, startTime, rideId, passengers } = ride;

          // Ensure the destinationLocation and coordinates are valid
          if (!destinationLocation || !destinationLocation.coordinates) {
            console.warn(`Invalid destination data for ride ${rideId}`); // Log invalid ride data
            return <p key={rideId}>Error: Invalid ride data</p>;
          }

          // Check if the current user is in the passengers list and the passenger count is less than 3
          const isValidForAdd =
            passengers.length < 3 && !passengers.some((passenger) => passenger.clerkId === clerkID);

          console.log(`Ride ${rideId} - Valid for adding:`, isValidForAdd); // Log the add condition

          if (!isValidForAdd) {
            return null; // Skip this ride if it doesn't meet the condition
          }

          const [destinationLongitude, destinationLatitude] = destinationLocation.coordinates;
          const geoApiUrl = `https://maps.geoapify.com/v1/staticmap?style=osm-bright-smooth&width=600&height=400&center=lonlat:${destinationLongitude},${destinationLatitude}&zoom=14&apiKey=5312629079c24b608f9ca2bcaa5fce0b`;

          return (
            <li key={rideId} className="p-4 border rounded-md bg-gray-800 shadow-sm flex">
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
                  <strong>Origin:</strong> {origin}
                </p>
                <p>
                  <strong>Destination:</strong> {destination}
                </p>
                <p>
                  <strong>Start Time:</strong> {new Date(startTime).toLocaleString()}
                </p>

                <div className="flex space-x-4 mt-4">
                  {/* Add me to ride button */}
                  <button
                    onClick={() => handleAddToRide(rideId)}
                    className="bg-green-500 p-2 rounded-md"
                  >
                    Add me to ride
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default AllRidesPage;
