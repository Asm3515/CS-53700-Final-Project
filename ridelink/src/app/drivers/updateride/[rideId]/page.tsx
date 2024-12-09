"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";
import { Ride } from "@/components/Types/RideType";

const UpdateRidePage = () => {
  const params = useParams();
  const router = useRouter();
  const { userId } = useAuth();
  const rideId = params.rideId as string;
  console.log(rideId);

  // State for ride details
  const [ride, setRide] = useState<Ride | null>(null);

  // State for form inputs
  const [origin, setOrigin] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [availableSeats, setAvailableSeats] = useState<number>(0);

  // State for form handling
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // State for updating passenger fares
  const [passengerFares, setPassengerFares] = useState<{ [key: string]: number }>({});

  // Fetch ride details when component mounts
  useEffect(() => {
    const fetchRideDetails = async () => {
      try {
        setLoading(true);
        
        // Log the request before making it
        console.log("API Request: Fetch Ride Details", `/api/rides?rideId=${rideId}`);
        
        const response = await axios.get(`/api/rides?rideId=${rideId}`);
        
        // Log the response after receiving it
        console.log("API Response: Fetch Ride Details", response.data);

        const rideData = response.data;

        // Additional check to ensure the ride belongs to the current user
        if (rideData.rider !== userId) {
          setError("You are not authorized to update this ride.");
          return;
        }

        setRide(rideData);
        
        // Populate form fields with existing ride data
        setOrigin(rideData.origin);
        setDestination(rideData.destination);
        setStartTime(new Date(rideData.startTime).toISOString().slice(0, 16)); // Format for datetime-local input
        setAvailableSeats(rideData.availableSeats || 0);
        
        // Initialize passenger fares
        const fares: { [key: string]: number } = {};
        rideData.passengers.forEach((passenger: any) => {
          fares[passenger.id] = passenger.fare || 0;
        });
        setPassengerFares(fares);

      } catch (err) {
        console.error("Error fetching ride details:", err);
        setError("Failed to fetch ride details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (rideId && userId) {
      fetchRideDetails();
    }
  }, [rideId, userId]);

  // Handle form submission
  const handleUpdateRide = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Prepare the data to send in the update request
      const updatedRideData = {
        origin,
        destination,
        startTime: new Date(startTime).toISOString(),
        availableSeats,
        riderId: userId,
        passengers: Object.keys(passengerFares).map((passengerId) => ({
          id: passengerId,
          fare: passengerFares[passengerId],
        })),
      };

      // Log the request before making it
      console.log("API Request: Update Ride", `/api/rides/${rideId}`, updatedRideData);

      const response = await axios.put(`/api/rides/${rideId}`, updatedRideData);
      
      // Log the response after receiving it
      console.log("API Response: Update Ride", response.data);

      setSuccessMessage("Ride updated successfully!");

      // Optional: Redirect after successful update
      setTimeout(() => {
        router.push("/drivers/dashboard");
      }, 2000);
    } catch (err) {
      console.error("Error updating ride:", err);
      setError("Failed to update ride. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle cancellation
  const handleCancelRide = async () => {
    try {
      // Log the request before making it
      console.log("API Request: Cancel Ride", `/api/rides/${rideId}`);

      const response = await axios.delete(`/api/rides/${rideId}`);
      
      // Log the response after receiving it
      console.log("API Response: Cancel Ride", response.data);

      // Redirect to dashboard after cancellation
      router.push("/drivers/dashboard");
    } catch (err) {
      console.error("Error cancelling ride:", err);
      setError("Failed to cancel ride. Please try again.");
    }
  };

  // Handle fare update for a passenger
  const handleFareChange = (passengerId: string, newFare: number) => {
    setPassengerFares((prevFares) => ({
      ...prevFares,
      [passengerId]: newFare,
    }));
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <h2 className="text-2xl font-bold mb-4">Loading Ride Details...</h2>
        <p>Please wait while we fetch the ride information.</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
        <p>{error}</p>
        <button 
          onClick={() => router.push("/drivers/dashboard")}
          className="mt-4 bg-red-500 text-white p-2 rounded"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h2 className="text-2xl font-bold mb-6">Update Ride</h2>
      
      {successMessage && (
        <div className="bg-green-500 text-white p-4 rounded mb-4">
          {successMessage}
        </div>
      )}
      
      <form onSubmit={handleUpdateRide} className="max-w-md mx-auto">
        <div className="mb-4">
          <label htmlFor="origin" className="block text-gray-400 mb-2">
            Origin
          </label>
          <input
            type="text"
            id="origin"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            required
            className="w-full p-2 bg-gray-800 text-white rounded"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="destination" className="block text-gray-400 mb-2">
            Destination
          </label>
          <input
            type="text"
            id="destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
            className="w-full p-2 bg-gray-800 text-white rounded"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="startTime" className="block text-gray-400 mb-2">
            Start Time
          </label>
          <input
            type="datetime-local"
            id="startTime"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
            className="w-full p-2 bg-gray-800 text-white rounded"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="availableSeats" className="block text-gray-400 mb-2">
            Available Seats
          </label>
          <input
            type="number"
            id="availableSeats"
            value={availableSeats}
            onChange={(e) => setAvailableSeats(Number(e.target.value))}
            min="0"
            max="10"
            required
            className="w-full p-2 bg-gray-800 text-white rounded"
          />
        </div>

        {/* Passenger fare update section */}
        {ride?.passengers?.map((passenger: any) => (
          <div key={passenger.id} className="mb-4">
            <label className="block text-gray-400 mb-2">
              {`Fare for ${passenger.name}`}
            </label>
            <input
              type="number"
              value={passengerFares[passenger.id] || 0}
              onChange={(e) =>
                handleFareChange(passenger.id, Number(e.target.value))
              }
              min="0"
              className="w-full p-2 bg-gray-800 text-white rounded"
            />
          </div>
        ))}
        
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-yellow-500 text-black p-2 rounded flex-1 hover:bg-yellow-600 transition"
          >
            Update Ride
          </button>
          
          <button
            type="button"
            onClick={handleCancelRide}
            className="bg-red-500 text-white p-2 rounded flex-1 hover:bg-red-600 transition"
          >
            Cancel Ride
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateRidePage;
