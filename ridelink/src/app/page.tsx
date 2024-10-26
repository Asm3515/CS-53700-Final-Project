import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
} from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  return (
    <div className="grid justify-items-center bg-gradient-to-b from-neutral-900 to-neutral-600  font-[family-name:var(--font-geist-sans)] mb-20">
      <div className="md:flex p-8 md:p-16 items-center gap-20">
        <div className="text-4xl xl:text-6xl sm:text-xl md:text-3xl">
          Revolutionizing University Shuttle Services
        </div>
        <div className="mt-4 md:mt-0">
          <img
            src="/maps.jpg"
            alt="maps-static"
            className="rounded-lg w-full"
          />
        </div>
      </div>
      <div className="md:flex md:flex-row-reverse p-8 md:p-16 items-center gap-20 ">
        <div className="sm:text-xl md:text-3xl">
          Ride when you need, connect with ease
        </div>
        <div className="mt-4 md:mt-0">
          <img src="ride.jpg" alt="ride-img" className="rounded-lg md:w-full" />
        </div>
      </div>
      <div className="md:flex p-8 md:p-16 items-center gap-20 sm:block">
        <div className="sm:text-xl md:text-3xl ">
          Find riders heading your way in just a few clicks and save on gas!
        </div>
        <div className="mt-4 md:mt-0">
          <img
            src="/driver.jpg"
            alt="driver-img"
            className="rounded-lg md:w-full"
          />
        </div>
      </div>
    </div>
  );
}
