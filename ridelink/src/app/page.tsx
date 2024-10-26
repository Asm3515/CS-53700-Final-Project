import { SignedIn, SignedOut, SignInButton, SignOutButton } from "@clerk/nextjs";
import Link from "next/link"; 
import Image from "next/image";
 
export default function Home() {
  return (
<div className="flex flex-col items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
<header className="w-full text-center">
<h1 className="text-3xl font-bold mb-4">Welcome to RideLink</h1>
<p className="text-lg">Your go-to app for seamless ride sharing</p>
</header>
 
      <main className="flex flex-col md:flex-row items-center justify-around w-full gap-10">
<section className="text-center">
<SignedIn>
<SignOutButton />
</SignedIn>
<SignedOut>
<SignInButton />
</SignedOut>
<Image src="/ridelink_logo.png" alt="RideLink Banner" width={500} height={300} className="rounded-md" />
</section>
 
        <section className="text-center">
<Link href="/drivers" className="inline-block px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition">
            Go to Driver Registration
</Link>
</section>
</main>
 
      <footer className="w-full text-center text-sm text-gray-500">
        © 2024 RideLink. All rights reserved.
</footer>
</div>
  );
}