import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Script from "next/script";
import ConditionalNavbar from "@/components/ConditionalNavbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Weavy",
  description: "Artistic Intelligence",
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} bg-white`}>
          
          {/* ✅ STICKY HEADER CONTAINER */}
          <div className="fixed top-0 left-0 w-full z-[100]">
            
           

            {/* Navbar */}
            <ConditionalNavbar />
          </div>

          {/* PAGE CONTENT */}
          {/* Note: Because the header is 'fixed', it floats above content. 
              If your hero section isn't full-screen, you might need a 
              pt-24 (padding-top) on your main content wrapper.
          */}
          <main>
            {children}
          </main>

          {/* External scripts */}
          <Script
            src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"
            strategy="beforeInteractive"
          />
          <Script
            src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/Draggable.min.js"
            strategy="beforeInteractive"
          />
          <Script
            src="https://cdnjs.cloudflare.com/ajax/libs/leader-line/1.0.7/leader-line.min.js"
            strategy="beforeInteractive"
          />
          <Script
            type="module"
            src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js"
          />
        </body>
      </html>
    </ClerkProvider>
  );
}