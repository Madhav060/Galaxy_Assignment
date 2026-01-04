"use client";

import { useEffect, useRef } from "react";
import { Jost } from "next/font/google";

// 1. Changed weight from 500 to 400 (Regular)
const headingFont = Jost({
  subsets: ["latin"],
  weight: ["400"],
});

const IMAGES = {
  desktopUI:
    "https://cdn.prod.website-files.com/681b040781d5b5e278a69989/682ee0eea4106dbd4133065d_Weavy%20UI.avif",
  mobileUI:
    "https://cdn.prod.website-files.com/681b040781d5b5e278a69989/682eecb4b45672741cafa0f6_phone.avif",
  astronaut:
    "https://cdn.prod.website-files.com/681b040781d5b5e278a69989/682ee1e4018d126165811a7b_Astro.avif",
  spaceship:
    "https://cdn.prod.website-files.com/681b040781d5b5e278a69989/682ee1e4abc8a6ba31b611d5_spaceship.avif",
  directedBy:
    "https://cdn.prod.website-files.com/681b040781d5b5e278a69989/682ee1e3553ccb7b1eac8758_text%20-%20in%20astro.svg",
};

export default function HeroParallax() {
  const containerRef = useRef<HTMLDivElement>(null);

  const bgRef = useRef<HTMLImageElement>(null);
  const shipRef = useRef<HTMLImageElement>(null);
  const astroRef = useRef<HTMLImageElement>(null);
  const phoneRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLImageElement>(null);

  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const PARALLAX_STRENGTH = 90;

    const layers = [
      { ref: bgRef, depth: 0.35 },
      { ref: shipRef, depth: 0.55 },
      { ref: astroRef, depth: 0.2 },
      { ref: phoneRef, depth: -0.6 },
      { ref: textRef, depth: -0.8 },
    ];

    let rafId: number;

    const animate = () => {
      current.current.x += (target.current.x - current.current.x) * 0.12;
      current.current.y += (target.current.y - current.current.y) * 0.12;

      layers.forEach(({ ref, depth }) => {
        if (!ref.current) return;

        const baseX = Number(ref.current.dataset.x || 0);
        const baseY = Number(ref.current.dataset.y || 0);

        ref.current.style.transform = `
          translate(-50%, -50%)
          translate3d(
            ${baseX + current.current.x * depth * PARALLAX_STRENGTH}px,
            ${baseY + current.current.y * depth * PARALLAX_STRENGTH}px,
            0
          )
        `;
      });

      rafId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(rafId);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    target.current.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    target.current.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
  };

  const handleMouseLeave = () => {
    target.current.x = 0;
    target.current.y = 0;
  };

  return (
    <section className="relative w-full bg-[#f5f6f6] overflow-hidden">
      {/* ===== Heading ===== */}
      {/* 2. Reduced padding-bottom (pb) from 20 to 8 */}
      <div className="relative z-10 pt-28 pb-8 text-center">
        <h1
          className={`${headingFont.className} text-[90px] leading-[0.95] font-normal tracking-tight text-neutral-900`}
        >
          Control the <br /> Outcome
        </h1>

        <p className="mt-6 max-w-xl mx-auto text-[15px] leading-relaxed text-neutral-600">
          Layers, type, and blends—all the tools to bring your wildest ideas to
          life. Your creativity, our compositing power.
        </p>
      </div>

      {/* ===== Parallax Scene ===== */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative h-[70vh] w-full"
      >
        <img
          ref={bgRef}
          src={IMAGES.desktopUI}
          data-x="0"
          data-y="0"
          className="pointer-events-none absolute left-1/2 top-1/2
            w-[1400px] h-[800px] object-contain z-[1]"
        />

        <img
          ref={shipRef}
          src={IMAGES.spaceship}
          data-x="5"
          data-y="0"
          className="pointer-events-none absolute left-1/2 top-1/2
            w-[900px] h-[520px] object-contain z-[2]"
        />

        <img
          ref={astroRef}
          src={IMAGES.astronaut}
          data-x="0"
          data-y="20"
          className="pointer-events-none absolute left-1/2 top-1/2
            w-[700px] h-[800px] object-contain z-[3]"
        />

        <img
          ref={phoneRef}
          src={IMAGES.mobileUI}
          data-x="200"
          data-y="100"
          className="pointer-events-none absolute left-1/2 top-1/2
            w-[420px] h-[720px] object-contain z-[4]"
        />

        <img
          ref={textRef}
          src={IMAGES.directedBy}
          data-x="0"
          data-y="0"
          className="pointer-events-none absolute left-1/2 top-1/2
            w-[380px] h-[90px] object-contain z-[5]"
        />
      </div>
    </section>
  );
}