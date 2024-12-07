// types.ts or interfaces.ts
export interface Ride {
    rideId: string;
    origin: string;
    destination: string;
    startTime: string;
    fare: number;
    passengers: Array<{
      clerkId: string;
      fare: number;
      pickupLocation: string;
      dropoffLocation: string;
      pickupCoordinates: [number, number];
      dropoffCoordinates: [number, number];
      _id: string;
    }>;
    destinationLocation: {
      type: string; // e.g., "Point"
      coordinates: [number, number]; // [longitude, latitude]
    };
    startLocation: {
      type: string; // e.g., "Point"
      coordinates: [number, number]; // [longitude, latitude]
    };
    createdBy: string;
    _id: string;
    __v: number;
  }
  