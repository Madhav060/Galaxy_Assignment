"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/home/Navbar";

export default function ConditionalNavbar() {
  const pathname = usePathname();
  
  // Hide navbar on start-now and workflow editor pages
  if (pathname === "/start-now" || pathname?.startsWith("/workflow/")) {
    return null;
  }
  
  return <Navbar />;
}

