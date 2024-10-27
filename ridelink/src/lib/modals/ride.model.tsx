import { Schema, model, models } from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const RideSchema = new Schema({
  rideId: {
    type: String,
    default: uuidv4, // Automatically generate a UUID for each ride
    unique: true,
  },
  clerkId: {
    type: String,
    ref: "Rider", // Refers to the Rider schema
    required: true,
  },
  passengers: [
    {
      clerkId: {
        type: String,
        ref: "User", // References the User schema using clerkId
        required: true,
      },
    },
  ],
  startTime: {
    type: Date,
    required: true,
  },
  endTime: Date,
  origin: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  fare: {
    type: Number,
    default: 0, // Default fare to 0 if not specified
  },
});

// Create and export the Ride model
const Ride = models.Ride || model("Ride", RideSchema);
export default Ride;
