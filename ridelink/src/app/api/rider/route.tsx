import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/lib/db";
import Rider from "@/lib/modals/rider.model";
import User from "@/lib/modals/user.model";
import { request } from "http";
import { createECDH } from "crypto";

// GET handler to fetch Rider by clerkId
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

    await connect();

    // Find the rider based on the clerkId
    const rider = await Rider.findOne({ clerkId });

    if (!rider) {
      return new NextResponse(
        JSON.stringify({ message: "Rider not found" }),
        { status: 404 }
      );
    }

    return new NextResponse(JSON.stringify(rider), { status: 200 });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500 }
    );
  }
};



/**
 * Create a new Rider with clerkId.
 */
export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { clerkId, vehicleDetails, availability, ratings, status } = body;

    // Validate required fields
    if (!clerkId) {
      return NextResponse.json(
        { message: "clerkId is required" },
        { status: 400 }
      );
    }

    // Connect to the database
    await connect();

    // Check if the Rider with the given clerkId already exists
    const existingRider = await Rider.findOne({ clerkId });
    if (existingRider) {
      return NextResponse.json(
        { message: "Rider already exists" },
        { status: 400 }
      );
    }

    // Create a new Rider
    const newRider = await Rider.create({
      clerkId,
      vehicleDetails,
      availability,
      ratings,
      status,
    });

    // Return the created rider as a response
    return NextResponse.json(newRider, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
};


/**
 * Update an existing Rider based on the clerkId.
 */
export const PATCH = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { clerkId, vehicleDetails, availability, ratings, status } = body;

    // Validate required fields
    if (!clerkId) {
      return NextResponse.json(
        { message: "clerkId is required" },
        { status: 400 }
      );
    }

    await connect();

    // Find the Rider based on clerkId
    const existingRider = await Rider.findOne({ clerkId });
    if (!existingRider) {
      return NextResponse.json(
        { message: "Rider not found" },
        { status: 404 }
      );
    }

    // Update the Rider details
    const updatedRider = await Rider.findOneAndUpdate(
      { clerkId },
      { vehicleDetails, availability, ratings, status },
      { new: true, runValidators: true } // Options: return updated document, run validators
    );

    return NextResponse.json(updatedRider, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
};


/**
 * Delete an existing Rider based on the clerkId.
 */
export const DELETE = async (request: NextRequest) => {
  try {
    // Parse query parameters from the request URL
    const { searchParams } = new URL(request.url);
    const clerkId = searchParams.get("clerkId");

    if (!clerkId) {
      return NextResponse.json(
        { message: "clerkId is required" },
        { status: 400 }
      );
    }

    await connect();

    // Find the Rider based on clerkId
    const existingRider = await Rider.findOne({ clerkId });
    if (!existingRider) {
      return NextResponse.json(
        { message: "Rider not found" },
        { status: 404 }
      );
    }

    // Delete the Rider
    await Rider.deleteOne({ clerkId });

    return NextResponse.json(
      { message: "Rider deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
};