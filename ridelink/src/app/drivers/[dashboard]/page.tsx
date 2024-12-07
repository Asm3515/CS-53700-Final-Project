"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";  // Importing useRouter from next/navigation
import RideCard from "@/components/RideCard";
import { Ride } from "@/components/Types/RideType";

const DriverDashboard = () => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { userId } = useAuth();
  const router = useRouter();  // Initialize the router for navigation

  useEffect(() => {
    // If the user is not authenticated, redirect to login page
    if (!userId) {
      router.push("/sign-in");  // Redirecting to the login page
      return;
    }
    
    // If the user is authenticated, fetch rides
    fetchRides();
  }, [userId, router]);  // Adding router as a dependency

  const fetchRides = async () => {
    if (!userId) {
      setError("User is not authenticated.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`/api/rides?riderId=${userId}`);

      if (Array.isArray(response.data) && response.data.length === 0) {
        setError("No rides found for this Driver.");
        setRides([]);
      } else {
        setRides(response.data);
        setError(null);
      }
    } catch (error) {
      setError("Error fetching rides. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRide = async (rideId: string, passengers: string[]) => {
    if (passengers.length === 0) {
      try {
        await axios.delete(`/api/rides?rideId=${rideId}`);
        fetchRides();
      } catch (error) {
        setError("Error deleting ride.");
      }
    } else {
      try {
        await axios.delete(`/api/rides?rideId=${rideId}&driverId=${userId}`);
        fetchRides();
      } catch (error) {
        setError("Error removing Driver from ride.");
      }
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-black text-white">
        <h2 className="text-xl font-bold mb-4">Driver Dashboard</h2>
        <p>Loading rides...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-black text-white">
      <h2 className="text-xl font-bold mb-4">Driver Dashboard</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {rides.length === 0 ? (
        <p>No rides found for this Driver.</p>
      ) : (
        <ul className="space-y-4">
          {rides.map((ride) => (
            <RideCard
              key={ride.rideId}
              ride={ride}
              handleDeleteRide={handleDeleteRide}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default DriverDashboard;
