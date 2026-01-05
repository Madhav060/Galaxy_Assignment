'use client';

import React, { useState } from 'react';

// ---------------- ASSETS ----------------
const ASSETS = {
  crop: "https://cdn.prod.website-files.com/681b040781d5b5e278a69989/68224563af147b5d7c2496ff_Crop%402x.avif",
  outpaint: "https://cdn.prod.website-files.com/681b040781d5b5e278a69989/6822456436dd3ce4b39b6372_Outpaint%402x.avif",
  inpaint: "https://cdn.prod.website-files.com/681b040781d5b5e278a69989/682245639e16941f61edcc06_Inpaint%402x.avif",
  invert: "https://cdn.prod.website-files.com/681b040781d5b5e278a69989/68224563d93b3ce65b54f07b_Invert%402x.avif",
  upscale: "https://cdn.prod.website-files.com/681b040781d5b5e278a69989/682245638e6550c59d0bce8f_Upscale%402x.avif",
  maskExtractor: "https://cdn.prod.website-files.com/681b040781d5b5e278a69989/68224563d5cb54c747f189ae_Mask%402x.avif",
  zDepth: "https://cdn.prod.website-files.com/681b040781d5b5e278a69989/68224563290cc77eba8f086a_z%20depth%402x.avif",
  imageDescriber: "https://cdn.prod.website-files.com/681b040781d5b5e278a69989/6825ab42a8f361a9518d5a7f_Image%20describer%402x.avif",
  channels: "https://cdn.prod.website-files.com/681b040781d5b5e278a69989/682245646909d06ed8a17f4d_Channels%402x.avif",
  painter: "https://cdn.prod.website-files.com/681b040781d5b5e278a69989/682245634dee7dac1dc3ac42_Painter%402x.avif",
  relight: "https://cdn.prod.website-files.com/681b040781d5b5e278a69989/68224563b4846eaa2d70f69e_Relight%402x.avif",
  default: "https://cdn.prod.website-files.com/681b040781d5b5e278a69989/68223c9e9705b88c35e76dec_Default%402x.avif",
};

// ---------------- TOOL POSITIONS ----------------
const TOOLS = [
  { id: 'crop', label: 'Crop', image: ASSETS.crop, pos: 'top-[48%] left-[6%]' },
  { id: 'invert', label: 'Invert', image: ASSETS.invert, pos: 'top-[54%] left-[26%]' },
  { id: 'outpaint', label: 'Outpaint', image: ASSETS.outpaint, pos: 'top-[58%] left-[18%]' },
  { id: 'inpaint', label: 'Inpaint', image: ASSETS.inpaint, pos: 'top-[62%] left-[8%]' },
  { id: 'mask', label: 'Mask Extractor', image: ASSETS.maskExtractor, pos: 'top-[72%] left-[22%]' },
  { id: 'upscale', label: 'Upscale', image: ASSETS.upscale, pos: 'top-[80%] left-[10%]' },

  { id: 'painter', label: 'Painter', image: ASSETS.painter, pos: 'top-[48%] right-[2%]' },
  { id: 'channels', label: 'Channels', image: ASSETS.channels, pos: 'top-[56%] right-[10%]' },
  { id: 'describer', label: 'Image Describer', image: ASSETS.imageDescriber, pos: 'top-[62%] right-[16%]' },
  { id: 'relight', label: 'Relight', image: ASSETS.relight, pos: 'top-[70%] right-[4%]' },
  { id: 'zdepth', label: 'Z Depth Extractor', image: ASSETS.zDepth, pos: 'top-[80%] right-[18%]' },
];

// ---------------- BUTTON STYLE ----------------
const BTN =
  "absolute bg-gray-200/90 backdrop-blur " +
  "px-3 py-1 rounded-lg " +
  "border border-gray-300 " +
  "text-[15px] font-normal text-gray-800 " +
  "transition whitespace-nowrap " +
  "hover:bg-[#F3F28A] hover:border-[#E6E36A]";

// ---------------- COMPONENT ----------------
export default function InteractiveWorkflowFinal() {
  const [activeImage, setActiveImage] = useState(ASSETS.default);

  return (
    <section className="relative w-full min-h-[95vh] bg-gradient-to-b from-white to-gray-200 overflow-hidden font-sans flex flex-col">
    {/* Grid Overlay */}
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)
        `,
        backgroundSize: "24px 24px",
      }}
    />

    {/* Heading */}
    <div className="relative z-10 text-center pt-2 md:pt-4">
      <h1
        className="
          text-[4.25rem] md:text-[5.5rem] lg:text-[6.25rem]
          font-medium tracking-tight leading-[1.05]
        "
      >
        With all the professional
        <br />
        tools you rely on
      </h1>

      <p className="text-gray-600 text-xl mt-1">
        In one seamless workflow
      </p>
    </div>

   {/* Image Area */}
<div className="relative z-10 flex-1 pb-4"> {/* Parent: relative + minimal pb */}
  <div
    className="
      absolute inset-x-0 bottom-0
      w-[99vw]
      max-w-[1350px]
      mx-auto
      aspect-[16/9]
      rounded-[40px]
      overflow-hidden
      -translate-y-[3%]
      transition-transform
      duration-300
      ease-out
    "
  >
    <img
      src={activeImage}
      alt="Workflow"
      className="w-full h-full object-cover"
    />

    <div className="absolute inset-0">
      {TOOLS.map((t) => (
        <button
          key={t.id}
          onMouseEnter={() => setActiveImage(t.image)}
          onMouseLeave={() => setActiveImage(ASSETS.default)}
          className={`${BTN} ${t.pos}`}
        >
          {t.label}
        </button>
      ))}
    </div>
  </div>
</div>

  </section>
  );
}
