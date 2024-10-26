import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
} from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-black text-white min-h-screen gap-8 flex flex-col justify-between">
      <div className="flex flex-col  md:flex-row items-center justify-between p-8 md:p-16">
        <div className="flex-1 md:pr-10 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Revolutionizing University Shuttle Services
          </h1>
          <p className="mt-4 text-lg md:text-xl">
            Ride when you need, connect with ease.
          </p>
          <SignInButton>
            <button className="mt-6 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded shadow transition">
              Get Started
            </button>
          </SignInButton>
        </div>
        <div className="mt-8 md:mt-0 md:flex-1">
          <img
            src="/maps.jpg"
            alt="maps-static"
            className="rounded-lg shadow-lg w-full h-auto object-cover transition-transform transform hover:scale-105 duration-300"
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row bg-white text-black p-8 md:p-16 md:mx-8 items-center gap-10 rounded-lg shadow-lg">
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl font-semibold">Find Riders Quickly</h2>
          <p className="mt-2 text-lg">
            Connect with students heading your way in just a few clicks and save
            on gas!
          </p>
        </div>
        <div className="flex-1 mt-4 md:mt-0">
          <img
            src="ride.jpg"
            alt="ride-img"
            className="rounded-lg shadow-lg transition-transform transform hover:scale-105 duration-300"
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row bg-white text-black p-8 md:p-16 md:mx-8 items-center gap-10 rounded-lg shadow-lg">
        <div className="flex-1 mt-4 md:mt-0">
          <img
            src="/driver.jpg"
            alt="driver-img"
            className="rounded-lg shadow-lg transition-transform transform hover:scale-105 duration-300"
          />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl font-semibold">Save on Fuel Costs</h2>
          <p className="mt-2 text-lg">
            Join our community and make your rides affordable while helping
            others.
          </p>
        </div>
      </div>
    </div>
  );
}
