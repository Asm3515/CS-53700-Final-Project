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
      router.push("/sign-in"); // Redirecting to the login page
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
    router.push("/rides/findrides"); // Navigate to the find rides page
  };

  const handleRequestRide = () => {
    router.push("/rides/requestride"); // Navigate to the request ride page
  };

  if (loading) {
    return (
      <div className="p-6 bg-black text-white min-h-screen">
        <h2 className="text-2xl font-bold mb-4">Passenger Dashboard</h2>
        <p className="text-lg">Loading rides...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-black text-white min-h-screen flex flex-col gap-8">
      <h2 className="text-2xl md:text-3xl font-bold text-center">Passenger Dashboard</h2>
      {/* {error && (
        <div className="bg-red-500 text-white p-4 rounded-md shadow">
          <p className="text-lg">{error}</p>
        </div>
      )} */}
      <div className="flex flex-col md:flex-row gap-4 justify-center">
        <button
          onClick={handleFindRides}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-md shadow transition duration-300"
        >
          Find Rides
        </button>
        <button
          onClick={handleRequestRide}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-md shadow transition duration-300"
        >
          Request Ride
        </button>
      </div>
      {rides.length === 0 ? (
        <div className="text-center text-lg mt-8">
          <p>No rides found for this passenger.</p>
        </div>
      ) : (
        <ul className="space-y-6">
          {rides.map((ride) => (
            <RideCard key={ride.rideId} ride={ride} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default PassengerDashboard;
