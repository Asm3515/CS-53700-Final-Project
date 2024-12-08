"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Ride } from "../../../components/Types/RideType";
import RideCard from "../../../components/RideCard"; // Import the RideCard component
import { useAuth } from "@clerk/nextjs";

const ridesApiUrl = "/api/rides";

const AllRidesPage: React.FC = () => {
  const { userId } = useAuth();
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch all rides when the component mounts
  useEffect(() => {
    const fetchRides = async () => {
      try {
        const response = await fetch(ridesApiUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch rides");
        }
        const data = await response.json();
        setRides(data); // Assuming the response is an array of rides
      } catch (err) {
        setError("Error fetching rides. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, []);

  // Show loading state or error if necessary
  if (loading) {
    return <p>Loading rides...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const clerkID = userId; // This is the Clerk User ID (clerkID)

  const handleAddToRide = async (rideId: string) => {
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
      alert("You are added to ride successfully");
      router.push("/passenger/dashboard");
      // Optionally, you could redirect the user or update the UI
      setRides((prevRides) =>
        prevRides.map((ride) =>
          ride.rideId === rideId
            ? { ...ride, passengers: updatedRide.passengers }
            : ride
        )
      );
    } catch (err) {
      console.error("Error adding user to ride:", err); // Log error if PATCH request fails
    }
  };

  return (
    <div className="p-6 bg-black min-h-screen text-white">
      <h1 className="text-3xl font-bold text-yellow-500 mb-6 text-center">
        Available Rides
      </h1>
      <ul className="space-y-6">
        {rides.map((ride) => {
          const {
            destinationLocation,
            origin,
            destination,
            startTime,
            rideId,
            passengers,
          } = ride;

          // Ensure the destinationLocation and coordinates are valid
          if (!destinationLocation || !destinationLocation.coordinates) {
            console.warn(`Invalid destination data for ride ${rideId}`); // Log invalid ride data
            return <p key={rideId}>Error: Invalid ride data</p>;
          }

          // Check if the current user is in the passengers list and the passenger count is less than 3
          const isValidForAdd =
            passengers.length < 3 &&
            !passengers.some((passenger) => passenger.clerkId === clerkID);

          console.log(`Ride ${rideId} - Valid for adding:`, isValidForAdd); // Log the add condition

          if (!isValidForAdd) {
            return null; // Skip this ride if it doesn't meet the condition
          }

          return (
            <RideCard
              key={ride.rideId}
              ride={ride}
              handleAddToRide={handleAddToRide}
              addToRide={true}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default AllRidesPage;
