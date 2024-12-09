// "use client";

// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { Ride } from "../../../components/Types/RideType";
// import { useAuth } from "@clerk/nextjs"; // Clerk authentication hook

// const ridesApiUrl = "/api/rides"; // API endpoint to fetch all rides

// const AllRidesPage: React.FC = () => {
//   const { userId } = useAuth(); // Get the authenticated user from Clerk
//   const [rides, setRides] = useState<Ride[]>([]);
//   const [filteredRides, setFilteredRides] = useState<Ride[]>([]); // State for filtered rides
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [searchTerm, setSearchTerm] = useState<string>(""); // State for the search input
//   const router = useRouter();

//   // Fetch all rides when the component mounts
//   useEffect(() => {
//     const fetchRides = async () => {
//       console.log("Fetching rides..."); // Log before API call
//       try {
//         const response = await fetch(ridesApiUrl);
//         if (!response.ok) {
//           throw new Error("Failed to fetch rides");
//         }
//         const data = await response.json();
//         console.log("Fetched rides data:", data); // Log the fetched data
//         setRides(data); // Assuming the response is an array of rides
//         setFilteredRides(data); // Initially, all rides are displayed
//       } catch (err) {
//         console.error("Error fetching rides:", err); // Log the error if fetch fails
//         setError("Error fetching rides. Please try again later.");
//       } finally {
//         setLoading(false);
//         console.log("Finished loading rides data"); // Log when loading is complete
//       }
//     };

//     fetchRides();
//   }, []);

//   // Show loading state or error if necessary
//   if (loading) {
//     console.log("Loading rides..."); // Log while loading
//     return <p>Loading rides...</p>;
//   }

//   if (error) {
//     console.log("Error state:", error); // Log error if there's one
//     return <p>{error}</p>;
//   }

//   const clerkID = userId; // This is the Clerk User ID (clerkID)
//   console.log("Authenticated Clerk ID:", clerkID); // Log the Clerk ID for debugging

//   // Filter rides based on search term
//   const handleSearch = (searchTerm: string) => {
//     setSearchTerm(searchTerm);
//     if (searchTerm === "") {
//       setFilteredRides(rides); // Show all rides if no search term
//     } else {
//       const filtered = rides.filter((ride) =>
//         ride.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         ride.destination.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//       setFilteredRides(filtered);
//     }
//   };

//   const handleAddToRide = async (rideId: string) => {
//     console.log(`Adding user ${clerkID} to ride ${rideId}`); // Log when adding user to ride
//     try {
//       // Find the ride with the given ID
//       const rideToUpdate = rides.find((ride) => ride.rideId === rideId);
//       if (!rideToUpdate) {
//         console.error(`Ride with ID ${rideId} not found`); // Log if ride not found
//         return;
//       }

//       const updatedRide = {
//         rider: clerkID, // Add the current user's Clerk ID as the rider
//         passengers: rideToUpdate.passengers, // Keep the existing passengers
//         origin: rideToUpdate.origin,
//         destination: rideToUpdate.destination,
//         startTime: rideToUpdate.startTime,
//         fare: rideToUpdate.fare,
//       };

//       const response = await fetch(`${ridesApiUrl}?rideId=${rideId}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(updatedRide),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to add to ride");
//       }

//       console.log("Successfully added user to ride"); // Log success
//       // Optionally, you could redirect the user or update the UI
//       setRides((prevRides) =>
//         prevRides.map((ride) =>
//           ride.rideId === rideId ? { ...ride, rider: clerkID } : ride
//         )
//       );
//       router.push("/drivers/dashboard");
//     } catch (err) {
//       console.error("Error adding user to ride:", err); // Log error if PATCH request fails
//     }
//   };

//   const handleBackToDashboard = () => {
//     router.push("/drivers/dashboard");
//   };

//   return (
//     <div className="p-4">
//       <h1 className="text-xl font-bold mb-4">All Rides</h1>
//       <button
//         onClick={handleBackToDashboard}
//         className="bg-blue-500 p-2 rounded-md mb-4"
//       >
//         Back to Dashboard
//       </button>

//       {/* Search bar */}
//       <div className="flex justify-center mb-4">
//       <input
//         type="text"
//         placeholder="Search rides by origin or destination"
//         value={searchTerm}
//         onChange={(e) => handleSearch(e.target.value)}
//         className="-2 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//       />
//       </div>

//       <ul className="space-y-4">
//         {filteredRides.map((ride) => {
//           const { destinationLocation, origin, destination, startTime, rideId, rider } = ride;

//           // Ensure the destinationLocation and coordinates are valid
//           if (!destinationLocation || !destinationLocation.coordinates) {
//             console.warn(`Invalid destination data for ride ${rideId}`); // Log invalid ride data
//             return <p key={rideId}>Error: Invalid ride data</p>;
//           }

//           // Only show rides that don't have a rider assigned yet (rider is null or not the current user)
//           if (rider && rider === clerkID) {
//             return null; // Skip this ride if the current user is already the rider
//           }

//           const [destinationLongitude, destinationLatitude] = destinationLocation.coordinates;
//           const geoApiUrl = `https://maps.geoapify.com/v1/staticmap?style=osm-bright-smooth&width=600&height=400&center=lonlat:${destinationLongitude},${destinationLatitude}&zoom=14&apiKey=5312629079c24b608f9ca2bcaa5fce0b`;

//           return (
//             <li key={rideId} className="p-4 border rounded-md bg-gray-800 shadow-sm flex">
//               {/* Map on the left side */}
//               <div className="w-1/2 pr-4">
//                 <img
//                   src={geoApiUrl}
//                   alt="Ride Location Map"
//                   className="w-full h-64 object-cover rounded-md"
//                 />
//               </div>

//               {/* Ride details on the right side */}
//               <div className="w-1/2">
//                 <p>
//                   <strong>Origin:</strong> {origin}
//                 </p>
//                 <p>
//                   <strong>Destination:</strong> {destination}
//                 </p>
//                 <p>
//                   <strong>Start Time:</strong> {new Date(startTime).toLocaleString()}
//                 </p>

//                 <div className="flex space-x-4 mt-4">
//                   {/* Add me to ride button */}
//                   <button
//                     onClick={() => handleAddToRide(rideId)}
//                     className="bg-green-500 p-2 rounded-md"
//                   >
//                     Add me to ride
//                   </button>
//                 </div>
//               </div>
//             </li>
//           );
//         })}
//       </ul>
//     </div>
//   );
// };

// export default AllRidesPage;

"use client"

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Ride } from "../../../components/Types/RideType";
import { useAuth } from "@clerk/nextjs"; // Clerk authentication hook
import  SearchBar  from "../../../components/SearchBar"; // Import SearchBar component

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
      console.log("Fetching rides..."); // Log before API call
      try {
        const response = await fetch(ridesApiUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch rides");
        }
        const data = await response.json();
        console.log("Fetched rides data:", data); // Log the fetched data
        setRides(data); // Assuming the response is an array of rides
        setFilteredRides(data); // Initially, all rides are displayed
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

  // Filter rides based on search term
  const handleSearch = (searchTerm: string) => {
    if (searchTerm === "") {
      setFilteredRides(rides); // Show all rides if no search term
    } else {
      const filtered = rides.filter((ride) =>
        ride.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ride.destination.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRides(filtered);
    }
  };

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
        rider: clerkID, // Add the current user's Clerk ID as the rider
        passengers: rideToUpdate.passengers, // Keep the existing passengers
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

      console.log("Successfully added user to ride"); // Log success
      // Optionally, you could redirect the user or update the UI
      setRides((prevRides) =>
        prevRides.map((ride) =>
          ride.rideId === rideId ? { ...ride, rider: clerkID } : ride
        )
      );
      router.push("/drivers/dashboard");
    } catch (err) {
      console.error("Error adding user to ride:", err); // Log error if PATCH request fails
    }
  };

  const handleBackToDashboard = () => {
    router.push("/drivers/dashboard");
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">All Rides</h1>
      
      {/* Back to Dashboard Button */}
      <button
        onClick={handleBackToDashboard}
        className="bg-blue-500 p-2 rounded-md mb-4"
      >
        Back to Dashboard
      </button>

      {/* Search Bar */}
      <div className="flex justify-center w-full mb-8">
      <SearchBar onSearch={handleSearch} />
      </div>
      <ul className="space-y-4">
        {filteredRides.map((ride) => {
          const { destinationLocation, origin, destination, startTime, rideId, rider } = ride;

          // Ensure the destinationLocation and coordinates are valid
          if (!destinationLocation || !destinationLocation.coordinates) {
            console.warn(`Invalid destination data for ride ${rideId}`); // Log invalid ride data
            return <p key={rideId}>Error: Invalid ride data</p>;
          }

          // Only show rides that don't have a rider assigned yet (rider is null or not the current user)
          if (rider && rider === clerkID) {
            return null; // Skip this ride if the current user is already the rider
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
