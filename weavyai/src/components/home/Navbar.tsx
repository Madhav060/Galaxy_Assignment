"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import UserProfile from "@/components/UserProfile";

const Navbar: React.FC = () => {
  const router = useRouter();

  const handleStartNowClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = "/start-now";
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-transparent">
      {/* Announcement Bar */}
      <div className="bg-black text-white py-2 px-4 text-center text-sm border-b border-white/5">
        <div className="flex items-center justify-center gap-2">
          <img 
            src="https://cdn.prod.website-files.com/681b040781d5b5e278a69989/69032e91ec29a8f27508fa9c_Image-Figma_acc.avif" 
            alt="Figma" 
            className="h-5"
          />
          <p><strong>Weavy is now a part of Figma</strong></p>
        </div>
      </div>

      {/* Navbar Content */}
      <div className="w-full px-6 h-16 flex items-center border-b border-black/5">
        
        {/* Left section: Logo and Subtitle */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex gap-[3px]">
              <span className="w-[6px] h-6 bg-black block" />
              <span className="w-[6px] h-6 bg-black block" />
              <span className="w-[6px] h-6 bg-black block" />
            </div>
            <span className="ml-2 text-sm font-medium tracking-wide text-black">
              WEAVY
            </span>
          </Link>

          <span className="h-6 w-px bg-black/20" />

          <span className="text-xs tracking-widest text-black/80 uppercase">
            Artistic Intelligence
          </span>
        </div>

        {/* Right-aligned container 
            ml-auto: Pushes this and everything after it to the right 
        */}
        <div className="ml-auto flex items-center gap-8">
          {/* Navigation Links */}
          <nav className="flex items-center gap-8 text-sm font-medium text-black/80">
            <Link href="/collective" className="hover:text-black transition">
              COLLECTIVE
            </Link>
            <Link href="/enterprise" className="hover:text-black transition">
              ENTERPRISE
            </Link>
            <Link href="/pricing" className="hover:text-black transition">
              PRICING
            </Link>
            <Link href="/request-demo" className="hover:text-black transition">
              REQUEST A DEMO
            </Link>
          </nav>

          {/* Auth Section */}
          <div className="flex items-center gap-6">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-sm font-medium text-black/80 hover:text-black transition">
                  SIGN IN
                </button>
              </SignInButton>
              
              <SignInButton mode="modal" fallbackRedirectUrl="/start-now">
                <button className="bg-[#e7ff3c] text-black px-4 py-2 text-sm font-semibold rounded-md hover:bg-[#dff02a] transition">
                  START NOW
                </button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <div className="flex items-center gap-6">
                <UserProfile />
                <button
                  onClick={handleStartNowClick}
                  className="bg-[#e7ff3c] text-black px-4 py-2 text-sm font-semibold rounded-md hover:bg-[#dff02a] transition"
                >
                  START NOW
                </button>
              </div>
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;