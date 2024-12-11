"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Ride } from "../../../components/Types/RideType";
import { useAuth } from "@clerk/nextjs"; // Clerk authentication hook
import SearchBar from "../../../components/SearchBar"; // Import SearchBar component

const ridesApiUrl = "/api/rides"; // API endpoint to fetch all rides

const AllRidesPage: React.FC = () => {
  const { userId } = useAuth(); // Get the authenticated user from Clerk
  const [rides, setRides] = useState<Ride[]>([]);
  const [filteredRides, setFilteredRides] = useState<Ride[]>([]); // State for filtered rides
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
        setFilteredRides(data); // Initially, all rides are displayed
      } catch (err) {
        setError("Error fetching rides. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, []);

  // Filter rides based on search term
  const handleSearch = (searchTerm: string) => {
    if (searchTerm === "") {
      setFilteredRides(rides); // Show all rides if no search term
    } else {
      const filtered = rides.filter(
        (ride) =>
          ride.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ride.destination.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRides(filtered);
    }
  };

  const handleAddToRide = async (rideId: string) => {
    try {
      const rideToUpdate = rides.find((ride) => ride.rideId === rideId);
      if (!rideToUpdate) {
        return;
      }

      const updatedRide = {
        rider: userId, // Add the current user's Clerk ID as the rider
        passengers: rideToUpdate.passengers,
        origin: rideToUpdate.origin,
        destination: rideToUpdate.destination,
        startTime: rideToUpdate.startTime,
        fare: rideToUpdate.fare,
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

      setRides((prevRides) =>
        prevRides.map((ride) =>
          ride.rideId === rideId ? { ...ride, rider: userId } : ride
        )
      );
      router.push("/drivers/dashboard");
    } catch (err) {
      console.error("Error adding user to ride:", err);
    }
  };

  const handleBackToDashboard = () => {
    router.push("/drivers/dashboard");
  };

  // Loading and Error States
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p className="text-xl font-bold">Loading rides...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p className="text-red-500 text-xl">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <button
        onClick={handleBackToDashboard}
        className="text-yellow-500 hover:text-yellow-600 hover:border py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
      >
        Back to Dashboard
      </button>
      <div className="text-center mb-8"></div>

      <h1 className="text-3xl font-bold text-yellow-500 text-center mb-6">
        All Rides
      </h1>

      {/* Back to Dashboard Button */}

      {/* Search Bar */}
      <div className="flex justify-center mb-6">
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Ride List */}
      {filteredRides.length === 0 ? (
        <div className="bg-gray-800 text-center p-6 rounded-lg shadow-md">
          <p className="text-xl text-gray-300">No rides found.</p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRides.map((ride) => {
            const {
              destinationLocation,
              origin,
              destination,
              startTime,
              rideId,
              rider,
            } = ride;

            if (!destinationLocation || !destinationLocation.coordinates) {
              return null;
            }

            if (rider && rider === userId) {
              return null;
            }

            const [destinationLongitude, destinationLatitude] =
              destinationLocation.coordinates;
            const geoApiUrl = `https://maps.geoapify.com/v1/staticmap?style=osm-bright-smooth&width=600&height=400&center=lonlat:${destinationLongitude},${destinationLatitude}&zoom=14&apiKey=5312629079c24b608f9ca2bcaa5fce0b`;

            return (
              <li
                key={rideId}
                className="bg-gray-900 p-4 rounded-lg shadow-md flex flex-col justify-between h-full"
              >
                {/* Map */}
                <div className="w-full h-48 md:h-64 mb-4">
                  <img
                    src={geoApiUrl}
                    alt="Ride Location Map"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>

                {/* Ride Details */}
                <div className="flex-grow">
                  <p className="text-lg">
                    <strong className="text-gray-400">Origin:</strong> {origin}
                  </p>
                  <p className="text-lg">
                    <strong className="text-gray-400">Destination:</strong>{" "}
                    {destination}
                  </p>
                  <p className="text-lg">
                    <strong className="text-gray-400">Start Time:</strong>{" "}
                    {new Date(startTime).toLocaleString()}
                  </p>
                </div>

                {/* Add to Ride Button */}
                <div className="mt-5">
                  <button
                    onClick={() => handleAddToRide(rideId)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105 w-full"
                  >
                    Accept this ride
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default AllRidesPage;
