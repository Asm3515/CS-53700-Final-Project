import Ride from "@/lib/modals/ride.model";
import { NextRequest, NextResponse } from "next/server";
import User from "@/lib/modals/user.model";
import Rider from "@/lib/modals/rider.model";
import {connect} from '@/lib/db'


export const GET = async (request: NextRequest) => {
    try {
      // Parse query parameters from the request URL
      const { searchParams } = new URL(request.url);
      const clerkId = searchParams.get("clerkId");
  
      if (!clerkId) {
        return new NextResponse(
          JSON.stringify({ message: "Invalid or missing clerkId" }),
          { status: 400 }
        );
      }
  
      // Connect to the database
      await connect();
  
      // Find all rides where clerkId matches the provided clerkId
      const rides = await Ride.find({ clerkId });
  
      if (rides.length === 0) {
        return new NextResponse(
          JSON.stringify({ message: "No rides found for the provided clerkId" }),
          { status: 404 }
        );
      }
  
      return new NextResponse(JSON.stringify(rides), { status: 200 });
    } catch (error) {
      return new NextResponse(
        JSON.stringify({ error: (error as Error).message }),
        { status: 500 }
      );
    }
  };



  
  export const POST = async (request: NextRequest) => {
    try {
      const body = await request.json();
      const { clerkId, passengers, startTime, endTime, origin, destination, fare } = body;
  
      // Validate required fields
      if (!clerkId || !passengers || !startTime || !origin || !destination) {
        return NextResponse.json(
          { message: "clerkId, passengers, startTime, origin, and destination are required" },
          { status: 400 }
        );
      }
  
      await connect();
  
      // Create a new Ride
      const newRide = await Ride.create({
        clerkId,
        passengers,
        startTime,
        endTime,
        origin,
        destination,
        fare,
      });
  
      // Return the created ride as a response
      return NextResponse.json(newRide, { status: 201 });
    } catch (error) {
      return NextResponse.json(
        { error: (error as Error).message },
        { status: 500 }
      );
    }
  };


  
export const DELETE = async (request: NextRequest) => {
  try {
    // Parse the rideId from the request URL
    const { searchParams } = new URL(request.url);
    const rideId = searchParams.get("rideId");

    // Validate that the rideId is provided
    if (!rideId) {
      return NextResponse.json(
        { message: "rideId is required" },
        { status: 400 }
      );
    }

    await connect();

    // Find and delete the ride by rideId
    const deletedRide = await Ride.findOneAndDelete({ rideId });

    if (!deletedRide) {
      return NextResponse.json(
        { message: "Ride not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Ride deleted successfully", rideId },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
};

export const PATCH = async (request: NextRequest) => {
  try {
    // Parse the rideId from the request URL
    const { searchParams } = new URL(request.url);
    const rideId = searchParams.get("rideId");

    // Validate that the rideId is provided
    if (!rideId) {
      return NextResponse.json(
        { message: "rideId is required" },
        { status: 400 }
      );
    }

    // Get the updated ride details from the request body
    const body = await request.json();
    const { startTime, endTime, origin, destination, fare, passengers } = body;

    await connect();

    // Find the ride and update it with the new details
    const updatedRide = await Ride.findOneAndUpdate(
      { rideId },
      {
        ...(startTime && { startTime }),
        ...(endTime && { endTime }),
        ...(origin && { origin }),
        ...(destination && { destination }),
        ...(fare && { fare }),
        ...(passengers && { passengers }),
      },
      { new: true } // Returns the updated document
    );

    if (!updatedRide) {
      return NextResponse.json(
        { message: "Ride not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedRide, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
};

