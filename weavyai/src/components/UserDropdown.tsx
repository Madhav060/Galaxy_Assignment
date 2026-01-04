"use client";

import { useState, useRef, useEffect } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { Settings, LogOut, Snowflake, ChevronDown, X } from "lucide-react";
import Link from "next/link";

interface UserDropdownProps {
  userName: string;
  userInitial: string;
  userImage?: string;
}

export default function UserDropdown({ userName, userInitial, userImage }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { signOut } = useClerk();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 w-full hover:bg-gray-800 rounded-lg p-2 transition-colors"
      >
        {userImage ? (
          <img
            src={userImage}
            alt={userName}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold">
            {userInitial}
          </div>
        )}
        <div className="flex-1 text-left">
          <p className="text-sm font-medium">{userName}</p>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              {userImage ? (
                <img
                  src={userImage}
                  alt={userName}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold">
                  {userInitial}
                </div>
              )}
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{userName}'s Workspace</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Credits */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Snowflake className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-300">Credits</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-white">150</span>
                <Link
                  href="/upgrade"
                  className="text-xs text-blue-400 hover:text-blue-300"
                  onClick={() => setIsOpen(false)}
                >
                  Upgrade for more
                </Link>
              </div>
            </div>
          </div>

          {/* Plan */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Plan</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-white">Free</span>
                <Link
                  href="/upgrade"
                  className="text-xs text-blue-400 hover:text-blue-300"
                  onClick={() => setIsOpen(false)}
                >
                  Upgrade
                </Link>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-2">
            <Link
              href="/settings"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="w-4 h-4" />
              <span className="text-sm">Settings</span>
            </Link>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Sign out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

