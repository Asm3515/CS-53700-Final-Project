"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import RideCard from "@/components/RideCard";
import { Ride } from "@/components/Types/RideType";

const PassengerDashboard = () => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { userId } = useAuth();
  const router = useRouter();

  const fetchRides = async () => {
    if (!userId) {
      router.push("/sign-in");  // Redirecting to the login page
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`/api/rides?passengerId=${userId}`);

      if (Array.isArray(response.data) && response.data.length === 0) {
        setError("No rides found for this passenger.");
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

  useEffect(() => {
    fetchRides();
  }, [userId]);

  const handleFindRides = () => {
    router.push("/rides/findrides");  // Navigate to the find rides page
  };

  const handleRequestRide = () => {
    router.push("/rides/requestride");  // Navigate to the request ride page
  };

  if (loading) {
    return (
      <div className="p-6 bg-black text-white">
        <h2 className="text-xl font-bold mb-4">Passenger Dashboard</h2>
        <p>Loading rides...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-black text-white">
      <h2 className="text-xl font-bold mb-4">Passenger Dashboard</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="space-y-4">
        <button
          onClick={handleFindRides}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Find Rides
        </button>
        <button
          onClick={handleRequestRide}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Request Ride
        </button>
      </div>
      {rides.length === 0 ? (
        <p>No rides found for this passenger.</p>
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

export default PassengerDashboard;
