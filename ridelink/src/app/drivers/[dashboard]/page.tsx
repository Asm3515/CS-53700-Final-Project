"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import RideCard from "@/components/RideCard_Driver";
import { Ride } from "@/components/Types/RideType";

const DriverDashboard = () => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { userId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!userId) {
      router.push("/sign-in");
      return;
    }

    checkRiderExists(userId).then((exists) => {
      if (!exists) {
        router.push("/drivers/register");
      } else {
        fetchRides();
      }
    });
  }, [userId, router]);

  const checkRiderExists = async (clerkId: string): Promise<boolean> => {
    try {
      const response = await axios.get(`/api/rider`, { params: { clerkId } });
      return response.data && response.data.clerkId === clerkId;
    } catch (error) {
      console.error("Error checking rider existence:", error);
      return false;
    }
  };

  const fetchRides = async () => {
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
      console.error("Error fetching rides:", error);
      setError("Error fetching rides. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRide = () => {
    router.push("/drivers/searchRide");
  };

  const handleUpdateRide = (rideId: string, rideStatus: string) => {
    if (rideStatus === "completed") {
      alert("This ride has been completed and cannot be updated or deleted.");
      return;
    }
    router.push(`/drivers/updateride/${rideId}`);
  };

  if (loading) {
    return (
      <div className="p-6 bg-black text-white min-h-screen flex items-center justify-center">
        <h2 className="text-2xl font-bold">Loading rides...</h2>
      </div>
    );
  }

  return (
    <div className="p-6 bg-black text-white min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold text-yellow-500 mb-6 text-center">
        Driver Dashboard
      </h1>
      <button
        onClick={handleCreateRide}
        className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105 mb-8"
      >
        Search Rides to Offer
      </button>
      {error && (
        <div className="bg-red-800 text-white p-4 rounded-md mb-6 text-center">
          <p>{error}</p>
        </div>
      )}

      {rides.length === 0 ? (
        <div className="bg-gray-800 text-center text-white p-6 rounded-lg shadow-md">
          <p>No rides found for this Driver.</p>
        </div>
      ) : (
        <ul className="space-y-6">
          {rides.map((ride) => (
            <RideCard
              key={ride.rideId}
              ride={ride}
              onUpdateRide={() => handleUpdateRide(ride.rideId, ride.status)}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default DriverDashboard;
