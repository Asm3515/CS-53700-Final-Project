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
        <div className="flex items-center gap-6">
          <Link href="/" passHref>
            <img
              src="/ridelink-logo-black.webp"
              alt="RideLink logo"
              className="h-10 w-auto cursor-pointer"
            />
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/ride">
            <span className="hover:underline cursor-pointer">Ride</span>
          </Link>
          <Link href="/drive">
            <span className="hover:underline cursor-pointer">Drive</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-6 z-10">
          {!isAuth ? (
            <>
              <Link href="/sign-in">
                <span className="hover:underline cursor-pointer">Login</span>
              </Link>
              <Link href="/sign-up">
                <span className="hover:underline cursor-pointer">Sign Up</span>
              </Link>
            </>
          ) : (
            <>
              <Link href="/profile">
                <span className="hover:underline cursor-pointer">Profile</span>
              </Link>
              <UserButton afterSignOutUrl="/" />
            </>
          )}
        </div>

        <div className="md:hidden relative">
          <input type="checkbox" id="menu-toggle" className="hidden peer" />
          <label
            htmlFor="menu-toggle"
            className="cursor-pointer"
            aria-label="Toggle Menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 peer-checked:hidden"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 hidden peer-checked:block"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </label>

          <div className="hidden peer-checked:flex flex-col items-center absolute top-full right-0 rounded-b-lg bg-neutral-800 text-white p-4 gap-4">
            <Link href="/ride">
              <span className="hover:underline cursor-pointer">Ride</span>
            </Link>
            <Link href="/drive">
              <span className="hover:underline cursor-pointer">Drive</span>
            </Link>

            {!isAuth ? (
              <>
                <Link href="/sign-in">
                  <span className="hover:underline cursor-pointer">Login</span>
                </Link>
                <Link href="/sign-up">
                  <span className="hover:underline cursor-pointer">
                    Sign Up
                  </span>
                </Link>
              </>
            ) : (
              <>
                <Link href="/profile">
                  <span className="hover:underline cursor-pointer">
                    Profile
                  </span>
                </Link>
                <UserButton afterSignOutUrl="/" />
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
