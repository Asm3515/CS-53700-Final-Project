"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import RideCard from "@/components/RideCard";
import { Ride } from "@/components/Types/RideType";

const DriverDashboard = () => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { userId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("User ID:", userId);
    if (!userId) {
      console.log("No user ID, redirecting to sign-in.");
      router.push("/sign-in");
      return;
    }

    checkRiderExists(userId).then((exists) => {
      if (!exists) {
        console.log("Rider does not exist, redirecting to register.");
        router.push("/drivers/register");
      } else {
        console.log("Rider exists, fetching rides.");
        fetchRides();
      }
    });
  }, [userId, router]);

  const checkRiderExists = async (clerkId: string): Promise<boolean> => {
    try {
      console.log("Checking if rider exists with clerkId:", clerkId);
      const response = await axios.get(`/api/rider`, {
        params: { clerkId },
      });
      console.log("Rider existence check response:", response.data);
  
      // Check if the response data is not null and contains valid rider information
      return response.data && response.data.clerkId === clerkId; 
    } catch (error) {
      console.error("Error checking rider existence:", error);
      return false;
    }
  };

  const fetchRides = async () => {
    try {
      console.log("Fetching rides for riderId:", userId);
      setLoading(true);
      const response = await axios.get(`/api/rides?riderId=${userId}`);
      console.log("Fetch rides response:", response.data);

      if (Array.isArray(response.data) && response.data.length === 0) {
        console.log("No rides found for this driver.");
        setError("No rides found for this Driver.");
        setRides([]);
      } else {
        console.log("Rides found:", response.data);
        setRides(response.data);
        setError(null);
      }
    } catch (error) {
      console.error("Error fetching rides:", error);
      setError("Error fetching rides. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRide = () => {
    console.log("Redirecting to create ride.");
    router.push("/drivers/searchRide");
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

      <button
        onClick={handleCreateRide}
        className="bg-blue-500 p-2 rounded-md mb-4"
      >
        Search rides to offer
      </button>

      {rides.length === 0 ? (
        <p>No rides found for this Driver.</p>
      ) : (
        <ul className="space-y-4">
          {rides.map((ride) => (
            <RideCard key={ride.rideId} ride={ride} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default DriverDashboard;
