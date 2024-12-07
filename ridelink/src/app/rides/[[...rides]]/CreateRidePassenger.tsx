import React, { useState } from "react";

const CreateRidePassenger = () => {
  const [rideDetails, setRideDetails] = useState({
    startLocation: "",
    destinationLocation: "",
    startTime: "",
    passengers: [{ name: "", fare: "" }],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRideDetails({
      ...rideDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle API call to create the ride
  };

  return (
    <div>
      <h1>Create Ride for Passenger</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="startLocation"
          value={rideDetails.startLocation}
          onChange={handleChange}
          placeholder="Start Location"
        />
        <input
          type="text"
          name="destinationLocation"
          value={rideDetails.destinationLocation}
          onChange={handleChange}
          placeholder="Destination Location"
        />
        <input
          type="datetime-local"
          name="startTime"
          value={rideDetails.startTime}
          onChange={handleChange}
        />
        {/* Add passengers input dynamically */}
        <button type="submit">Create Ride</button>
      </form>
    </div>
  );
};

export default CreateRidePassenger;
