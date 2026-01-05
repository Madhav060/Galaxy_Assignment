"use client";

import React, { useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

interface MediaItem {
  name: string;
  src: string;
  type: 'image' | 'video';
}

const models: MediaItem[] = [
  { name: "GPT img 1", src: "https://cdn.prod.website-files.com/681b040781d5b5e278a69989/6825887e82ac8a8bb8139ebd_GPT%20img%201.avif", type: 'image' },
  { name: "Wan", src: "https://assets.weavy.ai/homepage/mobile-videos/wan.mp4", type: 'video' },
  { name: "SD 3.5", src: "https://cdn.prod.website-files.com/681b040781d5b5e278a69989/6825887d65bf65cc5194ac05_Imagen%203.avif", type: 'image' },
  { name: "Runway Gen-4", src: "https://assets.weavy.ai/homepage/mobile-videos/runway.mp4", type: 'video' },
  { name: "Imagen 3", src: "https://cdn.prod.website-files.com/681b040781d5b5e278a69989/6825887d8a7b4e937a86ea6a_Flux%20Pro%201.1%20Ultra.avif", type: 'image' },
  { name: "Veo 3", src: "https://assets.weavy.ai/homepage/mobile-videos/veo2.mp4", type: 'video' },
  { name: "Recraft V3", src: "https://cdn.prod.website-files.com/681b040781d5b5e278a69989/68258880f266d11a0748ab63_Minimax%20image%2001.avif", type: 'image' },
  { name: "Kling", src: "https://assets.weavy.ai/homepage/mobile-videos/kling.mp4", type: 'video' },
  { name: "Flux Pro 1.1 Ultra", src: "https://cdn.prod.website-files.com/681b040781d5b5e278a69989/6825887eda73c12eaa4c3ed8_Recraft%20V3.avif", type: 'image' },
  { name: "Minimax video", src: "https://assets.weavy.ai/homepage/mobile-videos/minimax.mp4", type: 'video' },
  { name: "Ideogram V3", src: "https://cdn.prod.website-files.com/681b040781d5b5e278a69989/6825887d9b7eb0abc91263b6_Ideogram%20V2.avif", type: 'image' },
  { name: "Luma ray 2", src: "https://assets.weavy.ai/homepage/mobile-videos/luma_raw_2.mp4", type: 'video' },
  { name: "Minimax image 01", src: "https://cdn.prod.website-files.com/681b040781d5b5e278a69989/68258880f266d11a0748ab63_Minimax%20image%2001.avif", type: 'image' },
  { name: "Hunyuan", src: "https://assets.weavy.ai/homepage/mobile-videos/hunyuan.mp4", type: 'video' },
  { name: "Bria", src: "https://cdn.prod.website-files.com/681b040781d5b5e278a69989/6825887e82ac8a8bb8139ebd_GPT%20img%201.avif", type: 'image' },
];

export default function ModelsSection() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const triggerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!triggerRef.current || !pinRef.current) return;

    ScrollTrigger.create({
      trigger: triggerRef.current,
      start: "top top",
      // End point determines how many "scrolls" it takes to finish the list
      end: `+=${models.length * 100}%`, 
      pin: pinRef.current,
      pinSpacing: true,
      scrub: 0.5,
      onUpdate: (self) => {
        const progress = self.progress;
        const index = Math.min(
          Math.floor(progress * models.length),
          models.length - 1
        );
        setActiveIndex(index);
      },
    });
  }, { scope: triggerRef });

  return (
    <div ref={triggerRef} className="relative w-full bg-black">
      {/* This inner div is pinned while scrolling happens */}
      <div
        ref={pinRef}
        className="relative h-screen w-full overflow-hidden text-white"
      >
        {/* Background Media Layer */}
        <div className="absolute inset-0 z-0">
          {models.map((model, index) => (
            <div
              key={index}
              className="absolute inset-0 transition-opacity duration-700 ease-in-out"
              style={{
                opacity: activeIndex === index ? 1 : 0,
                visibility: activeIndex === index ? 'visible' : 'hidden'
              }}
            >
              {model.type === 'image' ? (
                <img src={model.src} alt={model.name} className="w-full h-full object-cover" />
              ) : (
                <video 
                  src={model.src} 
                  autoPlay 
                  muted 
                  loop 
                  playsInline 
                  className="w-full h-full object-cover" 
                />
              )}
              <div className="absolute inset-0 bg-black/60" />
            </div>
          ))}
        </div>

        <div className="relative h-full w-full flex items-center">
          
          {/* LEFT: Fixed Content Section */}
          <div className="absolute left-4 md:left-8 xl:left-12 top-1/2 -translate-y-1/2 z-30 max-w-lg pl-2 md:pl-4">
            <div className="flex flex-col h-[80vh] justify-center">
              <h2 className="text-[2.1rem] md:text-[3.5rem] lg:text-[4.9rem] xl:text-[5.6rem] font-normal leading-[0.9] tracking-tight mb-8 md:mb-12 text-white drop-shadow-2xl">
                Use all AI<br className="hidden md:block" />
                <span >models,</span><br />
                together at last
              </h2>
              <p className="text-base md:text-lg lg:text-xl text-gray-200 leading-relaxed max-w-md font-light tracking-wide">
                AI models and professional editing tools in one node-based platform. 
                Turn creative vision into scalable workflows without compromising quality.
              </p>
            </div>
          </div>

  {/* CENTERED: Animated Model List */}
<div className="absolute left-1/2 -translate-x-1/2 w-full max-w-4xl h-full flex items-center justify-center z-20 px-8">
  <div 
    className="flex flex-col items-center transition-transform duration-500 ease-out w-full"
    style={{ 
      // Offsets the list to keep the active item centered
      transform: `translateY(${(models.length / 2 - activeIndex - 0.5) * 10}vh)` 
    }}
  >
    {models.map((model, index) => (
      <div
        key={index}
        className="transition-all duration-500 ease-in-out whitespace-nowrap text-center w-full h-[10vh] flex items-center justify-center"
        style={{
          fontSize: "clamp(2.1rem, 9vw, 5.6rem)", 
          fontWeight: 400,
          lineHeight: 0.9,
          letterSpacing: "-0.025em",
          // Text is white by default, yellowish (#f7ff9e) when active
          color: activeIndex === index ? "#f7ff9e" : "#ffffff",
          // Opacity stays 100% for everyone
          opacity: 1,
          // Scale is now 1 for everyone so text size stays the same
          transform: "scale(1)",
          filter: activeIndex === index 
            ? "drop-shadow(0 0 15px rgba(247, 255, 158, 0.3))" 
            : "none"
        }}
      >
        {model.name}
      </div>
    ))}
  </div>
</div>
        </div>
      </div>
    </div>
  );
}