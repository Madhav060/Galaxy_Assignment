"use client";

import React from "react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import UserProfile from "@/components/UserProfile";

const Navbar: React.FC = () => {
  return (
    <header className="w-full bg-[#eef1ef] border-b border-black/10">
      <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center gap-6">
          {/* Logo mark */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex gap-[3px]">
              <span className="w-[6px] h-6 bg-black block" />
              <span className="w-[6px] h-6 bg-black block" />
              <span className="w-[6px] h-6 bg-black block" />
            </div>
            <span className="ml-2 text-sm font-medium tracking-wide">
              WEAVY
            </span>
          </Link>

          {/* Divider */}
          <span className="h-6 w-px bg-black/20" />

          {/* Subtitle */}
          <span className="text-xs tracking-widest text-black/80">
            ARTISTIC INTELLIGENCE
          </span>
        </div>

        {/* Right section */}
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

          {/* Sign In / User Profile */}
          <SignedOut>
            <SignInButton mode="modal">
              <button className="hover:text-black transition">
                SIGN IN
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserProfile />
          </SignedIn>

          {/* CTA - Start Now */}
          <SignedOut>
            <SignInButton mode="modal" fallbackRedirectUrl="/start-now">
              <button className="ml-2 bg-[#e7ff3c] text-black px-4 py-2 text-sm font-semibold rounded-md hover:bg-[#dff02a] transition">
                START NOW
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link
              href="/start-now"
              className="ml-2 bg-[#e7ff3c] text-black px-4 py-2 text-sm font-semibold rounded-md hover:bg-[#dff02a] transition inline-block"
            >
              START NOW
            </Link>
          </SignedIn>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
