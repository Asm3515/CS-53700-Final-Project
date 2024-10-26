import React from "react";
import Link from "next/link";
import { UserButton, useAuth } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

const Navbar = async () => {
  const { userId } = await auth();
  const isAuth = !!userId;

  return (
    <header className="bg-black text-white p-4">
      <div className="flex justify-between items-center mx-auto max-w-6xl">
        {/* Logo and Navigation Links */}
        <div className="flex items-center gap-6">
          <Link href="/" passHref>
            <img
              src="/ridelink-logo-black.webp"
              alt="RideLink logo"
              className="h-10 w-auto cursor-pointer"
            />
          </Link>
          <ul className="flex gap-6 list-none">
            <Link href="/ride">
              <li className="hover:underline cursor-pointer">Ride</li>
            </Link>
            <Link href="/drive">
              <li className="hover:underline cursor-pointer">Drive</li>
            </Link>
          </ul>
        </div>

        {/* Authentication Links */}
        <ul className="flex items-center gap-6 list-none">
          {!isAuth ? (
            <>
              <Link href="/sign-in">
                <li className="hover:underline cursor-pointer">Login</li>
              </Link>
              <Link href="/sign-up">
                <li className="hover:underline cursor-pointer">Sign Up</li>
              </Link>
            </>
          ) : (
            <>
              <Link href="/profile">
                <li className="hover:underline cursor-pointer">Profile</li>
              </Link>
              <li>
                <UserButton afterSignOutUrl="/" />
              </li>
            </>
          )}
        </ul>
      </div>
    </header>
  );
};

export default Navbar;
