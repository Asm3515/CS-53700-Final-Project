import { Schema, model, models } from "mongoose";

const RiderSchema = new Schema({
    clerkId: {
        type: String,
        ref: "User",
        required: true,
      },
    vehicleDetails: {
      type: String, // Example: "Toyota Prius, 2018"
    },
    availability: {
      type: [String], // Example: ['Monday', 'Wednesday']
    },
    ratings: {
      type: [Number], // Array to store ratings (e.g., [5, 4, 4])
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  });
  
  const Rider = models.Rider || model("Rider", RiderSchema);
  export default Rider;
  