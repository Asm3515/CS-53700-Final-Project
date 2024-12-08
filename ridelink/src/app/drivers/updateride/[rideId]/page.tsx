// "use client";

// import { useState, useEffect } from "react";
// import { useParams, useRouter } from "next/navigation";
// import axios from "axios";
// import { useAuth } from "@clerk/nextjs";
// import { Ride } from "@/components/Types/RideType";

// const UpdateRidePage = () => {
//   const params = useParams();
//   const router = useRouter();
//   const { userId } = useAuth();
//   const rideId = params.rideId as string;
//   console.log(rideId);

//   // State for ride details
//   const [ride, setRide] = useState<Ride | null>(null);

//   // State for form inputs
//   const [origin, setOrigin] = useState<string>("");
//   const [destination, setDestination] = useState<string>("");
//   const [startTime, setStartTime] = useState<string>("");

//   // State for form handling
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [successMessage, setSuccessMessage] = useState<string | null>(null);

//   // Fetch ride details when component mounts
//   useEffect(() => {
//     const fetchRideDetails = async () => {
//       try {
//         setLoading(true);
        
//         // Log the request before making it
//         console.log("API Request: Fetch Ride Details", `/api/rides?rideId=${rideId}`);
        
//         const response = await axios.get(`/api/rides?rideId=${rideId}`);
        
//         // Log the response after receiving it
//         console.log("API Response: Fetch Ride Details", response.data);

//         const rideData = response.data;

//         // Additional check to ensure the ride belongs to the current user
//         if (rideData.rider !== userId) {
//           setError("You are not authorized to update this ride.");
//           return;
//         }

//         setRide(rideData);
        
//         // Populate form fields with existing ride data
//         setOrigin(rideData.origin);
//         setDestination(rideData.destination);
//         setStartTime(new Date(rideData.startTime).toISOString().slice(0, 16)); // Format for datetime-local input

//       } catch (err) {
//         console.error("Error fetching ride details:", err);
//         setError("Failed to fetch ride details. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (rideId && userId) {
//       fetchRideDetails();
//     }
//   }, [rideId, userId]);

//   // Handle form submission
//   const handleUpdateRide = async (e: React.FormEvent) => {
//     e.preventDefault();
  
//     try {
//       setLoading(true);
  
//       // Start with the current ride data
//       const updatedRideData = { ...ride };  // Copy the existing ride data
  
//       // Update only the fields that have changed
//       if (origin !== ride?.origin) updatedRideData.origin = origin;
//       if (destination !== ride?.destination) updatedRideData.destination = destination;
//       if (startTime !== new Date(ride?.startTime).toISOString().slice(0, 16)) {
//         updatedRideData.startTime = new Date(startTime).toISOString();
//       }
  
//       // Log the request before making it
//       console.log("API Request: Update Ride", `/api/rides?rideId=${rideId}`, updatedRideData);
  
//       // Send the entire updated data with manipulated fields
//       const response = await axios.patch(`/api/rides?rideId=${rideId}`, updatedRideData);
  
//       // Log the response after receiving it
//       console.log("API Response: Update Ride", response.data);
  
//       setSuccessMessage("Ride updated successfully!");
  
//       // Redirect after successful update
//       setTimeout(() => {
//         router.push("/drivers/dashboard");
//       }, 2000);
//     } catch (err) {
//       console.error("Error updating ride:", err);
//       setError("Failed to update ride. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle cancellation
//   const handleCancelRide = async () => {
//     try {
//       setLoading(true);
//       setError(null);
  
//       // Log the request before making it
//       console.log("API Request: Cancel Ride", `/api/removerider?rideId=${rideId}`, { cancelRide: true });
  
//       // Send the PATCH request with cancelRide payload
//       const response = await axios.patch(
//         `/api/removerider?rideId=${rideId}`, 
//         { cancelRide: true }
//       );
  
//       // Log the response after receiving it
//       console.log("API Response: Cancel Ride", response.data);
  
//       setSuccessMessage("Rider has been removed successfully!");
  
//       // Redirect to the dashboard after a brief delay
//       setTimeout(() => {
//         router.push("/drivers/dashboard");
//       }, 2000);
//     } catch (err) {
//       console.error("Error canceling ride:", err);
//       setError("Failed to cancel ride. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBackToDashboard = () => {
//     router.push("/drivers/dashboard");
//   };

//   // Loading state
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-black text-white p-6">
//         <h2 className="text-2xl font-bold mb-4">Loading Ride Details...</h2>
//         <p>Please wait while we fetch the ride information.</p>
//       </div>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <div className="min-h-screen bg-black text-white p-6">
//         <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
//         <p>{error}</p>
//         <button 
//           onClick={() => router.push("/drivers/dashboard")}
//           className="mt-4 bg-red-500 text-white p-2 rounded"
//         >
//           Back to Dashboard
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-black text-white p-6">
//       <h2 className="text-2xl font-bold mb-6">Update Ride</h2>
      
//       {successMessage && (
//         <div className="bg-green-500 text-white p-4 rounded mb-4">
//           {successMessage}
//         </div>
//       )}
      
//       <form onSubmit={handleUpdateRide} className="max-w-md mx-auto">
//         <div className="mb-4">
//           <label htmlFor="origin" className="block text-gray-400 mb-2">
//             Origin
//           </label>
//           <input
//             type="text"
//             id="origin"
//             value={origin}
//             onChange={(e) => setOrigin(e.target.value)}
//             required
//             className="w-full p-2 bg-gray-800 text-white rounded"
//           />
//         </div>
        
//         <div className="mb-4">
//           <label htmlFor="destination" className="block text-gray-400 mb-2">
//             Destination
//           </label>
//           <input
//             type="text"
//             id="destination"
//             value={destination}
//             onChange={(e) => setDestination(e.target.value)}
//             required
//             className="w-full p-2 bg-gray-800 text-white rounded"
//           />
//         </div>
        
//         <div className="mb-4">
//           <label htmlFor="startTime" className="block text-gray-400 mb-2">
//             Start Time
//           </label>
//           <input
//             type="datetime-local"
//             id="startTime"
//             value={startTime}
//             onChange={(e) => setStartTime(e.target.value)}
//             required
//             className="w-full p-2 bg-gray-800 text-white rounded"
//           />
//         </div>

//         <div className="flex space-x-4">
//           <button
//             type="submit"
//             disabled={loading}
//             className="bg-yellow-500 text-black p-2 rounded flex-1 hover:bg-yellow-600 transition"
//           >
//             Update Ride
//           </button>
          
//           <button
//             type="button"
//             onClick={handleCancelRide}
//             className="bg-red-500 text-white p-2 rounded flex-1 hover:bg-red-600 transition"
//           >
//             Cancel Ride
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default UpdateRidePage;

// "use client";

// import { useState, useEffect } from "react";
// import { useParams, useRouter } from "next/navigation";
// import axios from "axios";
// import { useAuth } from "@clerk/nextjs";
// import { Ride } from "@/components/Types/RideType";

// const UpdateRidePage = () => {
//   const params = useParams();
//   const router = useRouter();
//   const { userId } = useAuth();
//   const rideId = params.rideId as string;
//   console.log(rideId);

//   // State for ride details
//   const [ride, setRide] = useState<Ride | null>(null);

//   // State for form inputs
//   const [origin, setOrigin] = useState<string>("");
//   const [destination, setDestination] = useState<string>("");
//   const [startTime, setStartTime] = useState<string>("");

//   // State for form handling
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [successMessage, setSuccessMessage] = useState<string | null>(null);

//   // State for autocomplete suggestions
//   const [originSuggestions, setOriginSuggestions] = useState<string[]>([]);
//   const [destinationSuggestions, setDestinationSuggestions] = useState<string[]>([]);

//   // Define the handleGeocode function
//   const handleGeocode = async (location: string) => {
//     try {
//       const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
//       const response = await axios.get(
//         `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
//           location
//         )}.json?access_token=${mapboxToken}`
//       );

//       // Filtering locations with USA as country
//       const filteredUSASuggestions = response.data.features.filter((feature) => {
//         return feature.context.some((context) => context.id.includes("country") && context.text === "United States");
//       });

//       return filteredUSASuggestions.map((feature) => ({
//         coordinates: feature.center,
//         placeName: feature.place_name,
//       }));
//     } catch (error) {
//       console.error("Geocoding error:", error);
//       return [];
//     }
//   };

//   // Fetch ride details when component mounts
//   useEffect(() => {
//     const fetchRideDetails = async () => {
//       try {
//         setLoading(true);

//         // Log the request before making it
//         console.log("API Request: Fetch Ride Details", `/api/rides?rideId=${rideId}`);

//         const response = await axios.get(`/api/rides?rideId=${rideId}`);

//         // Log the response after receiving it
//         console.log("API Response: Fetch Ride Details", response.data);

//         const rideData = response.data;

//         // Additional check to ensure the ride belongs to the current user
//         if (rideData.rider !== userId) {
//           setError("You are not authorized to update this ride.");
//           return;
//         }

//         setRide(rideData);

//         // Populate form fields with existing ride data
//         setOrigin(rideData.origin);
//         setDestination(rideData.destination);
//         setStartTime(new Date(rideData.startTime).toISOString().slice(0, 16)); // Format for datetime-local input
//       } catch (err) {
//         console.error("Error fetching ride details:", err);
//         setError("Failed to fetch ride details. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (rideId && userId) {
//       fetchRideDetails();
//     }
//   }, [rideId, userId]);

//   // Handle form submission
//   const handleUpdateRide = async (e: React.FormEvent) => {
//     e.preventDefault();

//     try {
//       setLoading(true);

//       // Start with the current ride data
//       const updatedRideData = { ...ride }; // Copy the existing ride data

//       // Update only the fields that have changed
//       if (origin !== ride?.origin) updatedRideData.origin = origin;
//       if (destination !== ride?.destination) updatedRideData.destination = destination;
//       if (startTime !== new Date(ride?.startTime).toISOString().slice(0, 16)) {
//         updatedRideData.startTime = new Date(startTime).toISOString();
//       }

//       // Log the request before making it
//       console.log("API Request: Update Ride", `/api/rides?rideId=${rideId}`, updatedRideData);

//       // Send the entire updated data with manipulated fields
//       const response = await axios.patch(`/api/rides?rideId=${rideId}`, updatedRideData);

//       // Log the response after receiving it
//       console.log("API Response: Update Ride", response.data);

//       setSuccessMessage("Ride updated successfully!");

//       // Redirect after successful update
//       setTimeout(() => {
//         router.push("/drivers/dashboard");
//       }, 2000);
//     } catch (err) {
//       console.error("Error updating ride:", err);
//       setError("Failed to update ride. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle cancellation
//   const handleCancelRide = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       // Log the request before making it
//       console.log("API Request: Cancel Ride", `/api/removerider?rideId=${rideId}`, { cancelRide: true });

//       // Send the PATCH request with cancelRide payload
//       const response = await axios.patch(
//         `/api/removerider?rideId=${rideId}`,
//         { cancelRide: true }
//       );

//       // Log the response after receiving it
//       console.log("API Response: Cancel Ride", response.data);

//       setSuccessMessage("Rider has been removed successfully!");

//       // Redirect to the dashboard after a brief delay
//       setTimeout(() => {
//         router.push("/drivers/dashboard");
//       }, 2000);
//     } catch (err) {
//       console.error("Error canceling ride:", err);
//       setError("Failed to cancel ride. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle back to dashboard button
//   const handleBackToDashboard = () => {
//     router.push("/drivers/dashboard");
//   };

//   // Function to handle changes in origin/destination input
//   const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'origin' | 'destination') => {
//     const value = e.target.value;
//     if (type === 'origin') {
//       setOrigin(value);
//       const suggestions = await handleGeocode(value);
//       setOriginSuggestions(suggestions.map(s => s.placeName));  // Update suggestions state
//     } else {
//       setDestination(value);
//       const suggestions = await handleGeocode(value);
//       setDestinationSuggestions(suggestions.map(s => s.placeName));  // Update suggestions state
//     }
//   };

//   // Loading state
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-black text-white p-6">
//         <h2 className="text-2xl font-bold mb-4">Loading Ride Details...</h2>
//         <p>Please wait while we fetch the ride information.</p>
//       </div>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <div className="min-h-screen bg-black text-white p-6">
//         <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
//         <p>{error}</p>
//         <button
//           onClick={handleBackToDashboard}
//           className="mt-4 bg-red-500 text-white p-2 rounded"
//         >
//           Back to Dashboard
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-black text-white p-6">
//       <h2 className="text-2xl font-bold mb-6">Update Ride</h2>

//       {successMessage && (
//         <div className="bg-green-500 text-white p-4 rounded mb-4">
//           {successMessage}
//         </div>
//       )}

//       <form onSubmit={handleUpdateRide} className="max-w-md mx-auto">
//         <div className="mb-4">
//           <label htmlFor="origin" className="block text-gray-400 mb-2">
//             Origin
//           </label>
//           <input
//             type="text"
//             id="origin"
//             value={origin}
//             onChange={(e) => handleInputChange(e, 'origin')}
//             required
//             className="w-full p-2 bg-gray-800 text-white rounded"
//           />
//           <ul className="bg-gray-800 text-white mt-2 p-2 rounded">
//             {originSuggestions.map((suggestion, idx) => (
//               <li
//                 key={idx}
//                 onClick={() => setOrigin(suggestion)}
//                 className="cursor-pointer hover:bg-gray-600 p-2"
//               >
//                 {suggestion}
//               </li>
//             ))}
//           </ul>
//         </div>

//         <div className="mb-4">
//           <label htmlFor="destination" className="block text-gray-400 mb-2">
//             Destination
//           </label>
//           <input
//             type="text"
//             id="destination"
//             value={destination}
//             onChange={(e) => handleInputChange(e, 'destination')}
//             required
//             className="w-full p-2 bg-gray-800 text-white rounded"
//           />
//           <ul className="bg-gray-800 text-white mt-2 p-2 rounded">
//             {destinationSuggestions.map((suggestion, idx) => (
//               <li
//                 key={idx}
//                 onClick={() => setDestination(suggestion)}
//                 className="cursor-pointer hover:bg-gray-600 p-2"
//               >
//                 {suggestion}
//               </li>
//             ))}
//           </ul>
//         </div>

//         <div className="mb-4">
//           <label htmlFor="startTime" className="block text-gray-400 mb-2">
//             Start Time
//           </label>
//           <input
//             type="datetime-local"
//             id="startTime"
//             value={startTime}
//             onChange={(e) => setStartTime(e.target.value)}
//             required
//             className="w-full p-2 bg-gray-800 text-white rounded"
//           />
//         </div>

//         <div className="flex space-x-4">
//           <button
//             type="submit"
//             disabled={loading}
//             className="bg-yellow-500 text-black p-2 rounded flex-1 hover:bg-yellow-600 transition"
//           >
//             Update Ride
//           </button>

//           <button
//             type="button"
//             onClick={handleCancelRide}
//             className="bg-red-500 text-white p-2 rounded flex-1 hover:bg-red-600 transition"
//           >
//             Cancel Ride
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default UpdateRidePage;



// "use client";

// import { useState, useEffect } from "react";
// import { useParams, useRouter } from "next/navigation";
// import axios from "axios";
// import { useAuth } from "@clerk/nextjs";
// import { Ride } from "@/components/Types/RideType";

// const UpdateRidePage = () => {
//   const params = useParams();
//   const router = useRouter();
//   const { userId } = useAuth();
//   const rideId = params.rideId as string;
//   console.log(rideId);

//   // State for ride details
//   const [ride, setRide] = useState<Ride | null>(null);

//   // State for form inputs
//   const [origin, setOrigin] = useState<string>("");
//   const [destination, setDestination] = useState<string>("");
//   const [startTime, setStartTime] = useState<string>("");

//   // State for form handling
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [successMessage, setSuccessMessage] = useState<string | null>(null);

//   // State for autocomplete suggestions
//   const [originSuggestions, setOriginSuggestions] = useState<string[]>([]);
//   const [destinationSuggestions, setDestinationSuggestions] = useState<string[]>([]);

//   // Define the handleGeocode function
//   const handleGeocode = async (location: string) => {
//     try {
//       const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
//       const response = await axios.get(
//         `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
//           location
//         )}.json?access_token=${mapboxToken}`
//       );

//       // Filtering locations with USA as country
//       const filteredUSASuggestions = response.data.features.filter((feature) => {
//         return feature.context.some((context) => context.id.includes("country") && context.text === "United States");
//       });

//       return filteredUSASuggestions.map((feature) => ({
//         coordinates: feature.center,
//         placeName: feature.place_name,
//       }));
//     } catch (error) {
//       console.error("Geocoding error:", error);
//       return [];
//     }
//   };

//   // Fetch ride details when component mounts
//   useEffect(() => {
//     const fetchRideDetails = async () => {
//       try {
//         setLoading(true);

//         // Log the request before making it
//         console.log("API Request: Fetch Ride Details", `/api/rides?rideId=${rideId}`);

//         const response = await axios.get(`/api/rides?rideId=${rideId}`);

//         // Log the response after receiving it
//         console.log("API Response: Fetch Ride Details", response.data);

//         const rideData = response.data;

//         // Additional check to ensure the ride belongs to the current user
//         if (rideData.rider !== userId) {
//           setError("You are not authorized to update this ride.");
//           return;
//         }

//         setRide(rideData);

//         // Populate form fields with existing ride data
//         setOrigin(rideData.origin);
//         setDestination(rideData.destination);
//         setStartTime(new Date(rideData.startTime).toISOString().slice(0, 16)); // Format for datetime-local input
//       } catch (err) {
//         console.error("Error fetching ride details:", err);
//         setError("Failed to fetch ride details. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (rideId && userId) {
//       fetchRideDetails();
//     }
//   }, [rideId, userId]);

//   // Handle form submission
//   const handleUpdateRide = async (e: React.FormEvent) => {
//     e.preventDefault();

//     try {
//       setLoading(true);

//       // Start with the current ride data
//       const updatedRideData = { ...ride }; // Copy the existing ride data

//       // Update only the fields that have changed
//       if (origin !== ride?.origin) updatedRideData.origin = origin;
//       if (destination !== ride?.destination) updatedRideData.destination = destination;
//       if (startTime !== new Date(ride?.startTime).toISOString().slice(0, 16)) {
//         updatedRideData.startTime = new Date(startTime).toISOString();
//       }

//       // Log the request before making it
//       console.log("API Request: Update Ride", `/api/rides?rideId=${rideId}`, updatedRideData);

//       // Send the entire updated data with manipulated fields
//       const response = await axios.patch(`/api/rides?rideId=${rideId}`, updatedRideData);

//       // Log the response after receiving it
//       console.log("API Response: Update Ride", response.data);

//       setSuccessMessage("Ride updated successfully!");

//       // Redirect after successful update
//       setTimeout(() => {
//         router.push("/drivers/dashboard");
//       }, 2000);
//     } catch (err) {
//       console.error("Error updating ride:", err);
//       setError("Failed to update ride. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle cancellation
//   const handleCancelRide = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       // Log the request before making it
//       console.log("API Request: Cancel Ride", `/api/removerider?rideId=${rideId}`, { cancelRide: true });

//       // Send the PATCH request with cancelRide payload
//       const response = await axios.patch(
//         `/api/removerider?rideId=${rideId}`,
//         { cancelRide: true }
//       );

//       // Log the response after receiving it
//       console.log("API Response: Cancel Ride", response.data);

//       setSuccessMessage("Rider has been removed successfully!");

//       // Redirect to the dashboard after a brief delay
//       setTimeout(() => {
//         router.push("/drivers/dashboard");
//       }, 2000);
//     } catch (err) {
//       console.error("Error canceling ride:", err);
//       setError("Failed to cancel ride. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle back to dashboard button
//   const handleBackToDashboard = () => {
//     router.push("/drivers/dashboard");
//   };

//   // Function to handle changes in origin/destination input
//   const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'origin' | 'destination') => {
//     const value = e.target.value;
//     if (type === 'origin') {
//       setOrigin(value);
//       const suggestions = await handleGeocode(value);
//       setOriginSuggestions(suggestions.map(s => s.placeName));  // Update suggestions state
//       setDestinationSuggestions([]); // Clear destination suggestions
//     } else {
//       setDestination(value);
//       const suggestions = await handleGeocode(value);
//       setDestinationSuggestions(suggestions.map(s => s.placeName));  // Update suggestions state
//       setOriginSuggestions([]); // Clear origin suggestions
//     }
//   };

//   // Loading state
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-black text-white p-6">
//         <h2 className="text-2xl font-bold mb-4">Loading Ride Details...</h2>
//         <p>Please wait while we fetch the ride information.</p>
//       </div>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <div className="min-h-screen bg-black text-white p-6">
//         <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
//         <p>{error}</p>
//         <button
//           onClick={handleBackToDashboard}
//           className="mt-4 bg-red-500 text-white p-2 rounded"
//         >
//           Back to Dashboard
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-black text-white p-6">
//       <h2 className="text-2xl font-bold mb-6">Update Ride</h2>

//       {successMessage && (
//         <div className="bg-green-500 text-white p-4 rounded mb-4">
//           {successMessage}
//         </div>
//       )}

//       <form onSubmit={handleUpdateRide} className="max-w-md mx-auto">
//         <div className="mb-4">
//           <label htmlFor="origin" className="block text-gray-400 mb-2">
//             Origin
//           </label>
//           <input
//             type="text"
//             id="origin"
//             value={origin}
//             onChange={(e) => handleInputChange(e, 'origin')}
//             required
//             className="w-full p-2 bg-gray-800 text-white rounded"
//           />
//           <ul className="bg-gray-800 text-white mt-2 p-2 rounded">
//             {originSuggestions.map((suggestion, idx) => (
//               <li
//                 key={idx}
//                 onClick={() => {
//                   setOrigin(suggestion);
//                   setOriginSuggestions([]); // Clear origin suggestions when selected
//                 }}
//                 className="cursor-pointer hover:bg-gray-600 p-2"
//               >
//                 {suggestion}
//               </li>
//             ))}
//           </ul>
//         </div>

//         <div className="mb-4">
//           <label htmlFor="destination" className="block text-gray-400 mb-2">
//             Destination
//           </label>
//           <input
//             type="text"
//             id="destination"
//             value={destination}
//             onChange={(e) => handleInputChange(e, 'destination')}
//             required
//             className="w-full p-2 bg-gray-800 text-white rounded"
//           />
//           <ul className="bg-gray-800 text-white mt-2 p-2 rounded">
//             {destinationSuggestions.map((suggestion, idx) => (
//               <li
//                 key={idx}
//                 onClick={() => {
//                   setDestination(suggestion);
//                   setDestinationSuggestions([]); // Clear destination suggestions when selected
//                 }}
//                 className="cursor-pointer hover:bg-gray-600 p-2"
//               >
//                 {suggestion}
//               </li>
//             ))}
//           </ul>
//         </div>

//         <div className="mb-4">
//           <label htmlFor="startTime" className="block text-gray-400 mb-2">
//             Start Time
//           </label>
//           <input
//             type="datetime-local"
//             id="startTime"
//             value={startTime}
//             onChange={(e) => setStartTime(e.target.value)}
//             required
//             className="w-full p-2 bg-gray-800 text-white rounded"
//           />
//         </div>

//         <div className="flex justify-between">
//           <button
//             type="submit"
//             className="bg-blue-500 text-white p-2 rounded"
//           >
//             Update Ride
//           </button>
//           <button
//             type="button"
//             onClick={handleCancelRide}
//             className="bg-red-500 text-white p-2 rounded"
//           >
//             Cancel Ride
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default UpdateRidePage;


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

  // State for ride details
  const [ride, setRide] = useState<Ride | null>(null);

  // State for form inputs
  const [origin, setOrigin] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");

  // State for latitude and longitude of origin and destination
  const [originCoordinates, setOriginCoordinates] = useState<[number, number] | null>(null);
  const [destinationCoordinates, setDestinationCoordinates] = useState<[number, number] | null>(null);

  // State for form handling
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // State for autocomplete suggestions
  const [originSuggestions, setOriginSuggestions] = useState<string[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<string[]>([]);

  // Define the handleGeocode function
  const handleGeocode = async (location: string) => {
    try {
      const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          location
        )}.json?access_token=${mapboxToken}`
      );

      // Filtering locations with USA as country
      const filteredUSASuggestions = response.data.features.filter((feature) => {
        return feature.context.some((context) => context.id.includes("country") && context.text === "United States");
      });

      return filteredUSASuggestions.map((feature) => ({
        coordinates: feature.center, // [longitude, latitude]
        placeName: feature.place_name,
      }));
    } catch (error) {
      console.error("Geocoding error:", error);
      return [];
    }
  };

  // Fetch ride details when component mounts
  useEffect(() => {
    const fetchRideDetails = async () => {
      try {
        setLoading(true);

        const response = await axios.get(`/api/rides?rideId=${rideId}`);

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
        setStartTime(new Date(rideData.startTime).toISOString().slice(0, 16));

        // Set origin and destination coordinates from the existing ride
        setOriginCoordinates(rideData.startLocation.coordinates);
        setDestinationCoordinates(rideData.destinationLocation.coordinates);
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

      // Start with the current ride data
      const updatedRideData = { ...ride }; // Copy the existing ride data

      // Update only the fields that have changed
      if (origin !== ride?.origin) updatedRideData.origin = origin;
      if (destination !== ride?.destination) updatedRideData.destination = destination;
      if (startTime !== new Date(ride?.startTime).toISOString().slice(0, 16)) {
        updatedRideData.startTime = new Date(startTime).toISOString();
      }

      // Update startLocation and destinationLocation with new coordinates if available
      if (originCoordinates && 
        (ride?.startLocation.coordinates[0] !== originCoordinates[0] || 
         ride?.startLocation.coordinates[1] !== originCoordinates[1])) {
      updatedRideData.startLocation = {
        type: "Point",
        coordinates: originCoordinates, // Set new origin coordinates
      };
    }
    
    if (destinationCoordinates && 
        (ride?.destinationLocation.coordinates[0] !== destinationCoordinates[0] || 
         ride?.destinationLocation.coordinates[1] !== destinationCoordinates[1])) {
      updatedRideData.destinationLocation = {
        type: "Point",
        coordinates: destinationCoordinates, // Set new destination coordinates
      };
    }

      const response = await axios.patch(`/api/rides?rideId=${rideId}`, updatedRideData);

      setSuccessMessage("Ride updated successfully!");

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
      setLoading(true);
      setError(null);

      const response = await axios.patch(`/api/removerider?rideId=${rideId}`, { cancelRide: true });

      setSuccessMessage("Rider has been removed successfully!");

      setTimeout(() => {
        router.push("/drivers/dashboard");
      }, 2000);
    } catch (err) {
      console.error("Error canceling ride:", err);
      setError("Failed to cancel ride. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle back to dashboard button
  const handleBackToDashboard = () => {
    router.push("/drivers/dashboard");
  };

  // Function to handle changes in origin/destination input
  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'origin' | 'destination') => {
    const value = e.target.value;
    if (type === 'origin') {
      setOrigin(value);
      const suggestions = await handleGeocode(value);
      setOriginSuggestions(suggestions.map(s => s.placeName));
      setOriginCoordinates(suggestions[0]?.coordinates || null);  // Set coordinates for origin
      setDestinationSuggestions([]); // Clear destination suggestions
    } else {
      setDestination(value);
      const suggestions = await handleGeocode(value);
      setDestinationSuggestions(suggestions.map(s => s.placeName));
      setDestinationCoordinates(suggestions[0]?.coordinates || null);  // Set coordinates for destination
      setOriginSuggestions([]); // Clear origin suggestions
    }
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
          onClick={handleBackToDashboard}
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
            onChange={(e) => handleInputChange(e, 'origin')}
            required
            className="w-full p-2 bg-gray-800 text-white rounded"
          />
          <ul className="bg-gray-800 text-white mt-2 p-2 rounded">
            {originSuggestions.map((suggestion, idx) => (
              <li
                key={idx}
                onClick={() => {
                  setOrigin(suggestion);
                  setOriginSuggestions([]); // Clear origin suggestions when selected
                }}
                className="cursor-pointer hover:bg-gray-600 p-2"
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-4">
          <label htmlFor="destination" className="block text-gray-400 mb-2">
            Destination
          </label>
          <input
            type="text"
            id="destination"
            value={destination}
            onChange={(e) => handleInputChange(e, 'destination')}
            required
            className="w-full p-2 bg-gray-800 text-white rounded"
          />
          <ul className="bg-gray-800 text-white mt-2 p-2 rounded">
            {destinationSuggestions.map((suggestion, idx) => (
              <li
                key={idx}
                onClick={() => {
                  setDestination(suggestion);
                  setDestinationSuggestions([]); // Clear destination suggestions when selected
                }}
                className="cursor-pointer hover:bg-gray-600 p-2"
              >
                {suggestion}
              </li>
            ))}
          </ul>
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

        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded"
          >
            Update Ride
          </button>
          <button
            type="button"
            onClick={handleCancelRide}
            className="bg-red-500 text-white p-2 rounded"
          >
            Cancel Ride
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateRidePage;
