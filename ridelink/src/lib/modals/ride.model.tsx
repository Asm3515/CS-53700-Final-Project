import { Schema, model, models } from "mongoose";

const RideSchema = new Schema({
    rider: {
      type: Schema.Types.ObjectId,
      ref: "Rider",
      required: true,
    },
    passengers: [
      { type: Schema.Types.ObjectId, ref: "User" }, // Users taking the ride
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
    fare: Number, // Optional fare for the ride
  });
  
  const Ride = models.Ride || model("Ride", RideSchema);
  export default Ride;
  