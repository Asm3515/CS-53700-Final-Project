import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkLoaded, ClerkLoading, ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <div className="mx-36 text-2xl">
            <ClerkLoading>
              <div className="flex flex-col items-center text-center mt-32">
                LOADING...
              </div>
            </ClerkLoading>
            <ClerkLoaded>
              <Navbar />
              {children}
            </ClerkLoaded>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}