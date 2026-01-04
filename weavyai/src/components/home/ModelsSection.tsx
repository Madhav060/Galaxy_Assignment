"use client";

import React, { useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react"; // Optional: if you have @gsap/react installed, otherwise useLayoutEffect

// Ensure ScrollTrigger is registered (safe to do multiple times)
gsap.registerPlugin(ScrollTrigger);

interface Model {
  name: string;
  src: string;
}

export default function ModelsSection() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const models: Model[] = [
    {
      name: "GPT img 1",
      src: "https://cdn.prod.website-files.com/681b040781d5b5e278a69989/6825887e82ac8a8bb8139ebd_GPT%20img%201.avif",
    },
    {
      name: "Wan",
      src: "https://cdn.prod.website-files.com/681b040781d5b5e278a69989/6825887d618a9071dd147d5f_SD%203.5.avif",
    },
    {
      name: "SD 3.5",
      src: "https://cdn.prod.website-files.com/681b040781d5b5e278a69989/6825887d65bf65cc5194ac05_Imagen%203.avif",
    },
    {
      name: "Runway Gen-4",
      src: "https://cdn.prod.website-files.com/681b040781d5b5e278a69989/6825887eda73c12eaa4c3ed8_Recraft%20V3.avif",
    },
    {
      name: "Imagen 3",
      src: "https://cdn.prod.website-files.com/681b040781d5b5e278a69989/6825887d8a7b4e937a86ea6a_Flux%20Pro%201.1%20Ultra.avif",
    },
    {
      name: "Veo 3",
      src: "https://cdn.prod.website-files.com/681b040781d5b5e278a69989/6825887d9b7eb0abc91263b6_Ideogram%20V2.avif",
    },
    {
      name: "Recraft V3",
      src: "https://cdn.prod.website-files.com/681b040781d5b5e278a69989/68258880f266d11a0748ab63_Minimax%20image%2001.avif",
    },
  ];

  // If you don't have @gsap/react, switch useGSAP to React.useLayoutEffect
  React.useLayoutEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top", // When top of trigger hits top of viewport
        end: "+=400%", // Pin for 400% of the viewport height (adjust for speed)
        pin: true, // Pin the container
        scrub: true, // Smooth scrubbing
        onUpdate: (self) => {
          // self.progress is a value between 0 and 1
          const progress = self.progress;
          // Calculate index based on progress
          const index = Math.min(
            Math.floor(progress * models.length),
            models.length - 1
          );
          setActiveIndex(index);
        },
      });
    }, containerRef);

    return () => ctx.revert(); // Cleanup on component unmount
  }, [models.length]);

  return (
    <div
      ref={containerRef}
      // CHANGED: Removed h-[400vh], used h-screen. GSAP handles the spacing via "pin".
      className="relative h-screen w-full overflow-hidden bg-transparent text-white"
    >
      <div className="h-full w-full flex flex-col justify-center">
        {/* Background Images Layer */}
        <div className="absolute inset-0 z-0">
          {models.map((model, index) => (
            <div
              key={index}
              className="absolute inset-0 transition-opacity duration-700 ease-in-out"
              style={{
                opacity: activeIndex === index ? 1 : 0,
                zIndex: activeIndex === index ? 10 : 0,
              }}
            >
              <img
                src={model.src}
                alt={model.name}
                className="w-full h-full object-cover"
              />
              {/* Dark overlay for text readability */}
              <div className="absolute inset-0 bg-black/50" />
            </div>
          ))}
        </div>

        {/* Content Grid */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Side: Static Text */}
            <div className="flex flex-col justify-center items-start text-left">
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-semibold mb-6 leading-tight">
                Use all AI models, together at last
              </h2>
              <p className="text-xl md:text-2xl lg:text-3xl text-gray-200 leading-relaxed max-w-lg">
                AI models and professional editing tools in one node-based
                platform. Turn creative vision into scalable workflows without
                compromising quality.
              </p>
            </div>

            {/* Right Side: Dynamic Model List */}
            <div className="flex flex-col items-center justify-center space-y-3">
              {models.map((model, index) => (
                <div
                  key={index}
                  className="transition-all duration-300 ease-out"
                  style={{
                    color:
                      activeIndex === index
                        ? "#f7ff9e"
                        : "rgba(255, 255, 255, 0.3)",
                    transform:
                      activeIndex === index ? "scale(1.1)" : "scale(1)",
                    fontWeight: activeIndex === index ? 600 : 300,
                  }}
                >
                  <h3 className="text-3xl md:text-5xl text-center cursor-default">
                    {model.name}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}