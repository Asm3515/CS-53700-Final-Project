import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <>
      {/* Gold Divider */}
      <div className="w-full h-[1px] bg-yellow-500 mb-4"></div>

      <footer className="row-start-3 flex flex-col items-center p-6 bg-black text-white md:flex-row md:justify-between">
        {/* Links */}
        <div className="flex flex-col items-center gap-2 mb-4 md:mb-0 md:items-start">
          <a href="/book-ride" className="text-lg hover:underline">
            Book a Ride
          </a>
          <a href="/give-ride" className="text-lg hover:underline">
            Give a Ride
          </a>
        </div>

        {/* Center Text */}
        <p className="text-center text-lg mb-4 md:mb-0">Share a ride!</p>

        {/* Logo with Link to Homepage */}
        <div className="flex items-center">
          <Link href="/" passHref>
            <img
              src="/ridelink-logo-black.webp"
              alt="Company Logo"
              className="h-10 w-auto cursor-pointer"
            />
          </Link>
        </div>
      </footer>
    </>
  );
};

export default Footer;
