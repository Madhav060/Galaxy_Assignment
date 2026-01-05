import React from "react";
import { ArrowRight } from "lucide-react";

const artists = [
  {
    name: "Yohan Wadia",
    role: "GEN AI DIRECTOR & INNOVATION STRATEGIST",
    image: "https://placehold.co/400x400/orange/white?text=Yohan+Wadia",
    avatar: "https://placehold.co/100x100/orange/white?text=YW",
    desc: "Cannes 2024 – setting a new standard for AI-powered brand storytelling.",
    color: "bg-[#f7ff9e]",
    span: "col-span-1",
  },
  {
    name: "Jovardi",
    role: "VISUAL STORYTELLER & AI EXPLORER",
    image: "https://placehold.co/400x800/222/white?text=Jovardi+Vertical",
    avatar: "https://placehold.co/100x100/222/white?text=JV",
    span: "md:row-span-2",
  },
  {
    name: "Edvard Toth",
    role: "CREATIVE TECHNOLOGIST & AI WORKFLOW ARCHITECT",
    image: "https://placehold.co/400x500/444/white?text=Edvard+Tech",
    avatar: "https://placehold.co/100x100/444/white?text=ET",
    desc: "With roots in game dev and interactive media, Edvard brings decades of experience leading creative tech at scale.",
    color: "bg-[#f7ff9e]",
    span: "col-span-1",
  },
  {
    name: "Luka Tisler",
    role: "VISUAL AI SPECIALIST & EDUCATOR",
    image: "https://placehold.co/400x300/666/white?text=Luka+Art",
    avatar: "https://placehold.co/100x100/666/white?text=LT",
    span: "col-span-1",
  },
  {
    name: "Billy Boman",
    role: "ARTIST",
    image: "https://placehold.co/400x350/333/white?text=Billy+Boman",
    avatar: "https://placehold.co/100x100/333/white?text=BB",
    span: "col-span-1",
  },
];

export default function ArtistCollectivePage() {
  return (
    <div className="w-full min-h-screen bg-[#f8f9fa] flex flex-col items-center overflow-visible">
      
      {/* 1. Artist Collective Section (Scaled 1.25x) */}
      <section 
        className="origin-top scale-[1.25] w-[80%] px-8 max-w-6xl mx-auto mt-[10%] pb-40"
      >
        <div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-xl">
            <h2 className="text-6xl font-medium tracking-tight mb-8 leading-[0.9]">
              Artist Collective Program
            </h2>
            <div className="space-y-4 text-[11px] text-gray-600 leading-relaxed max-w-xs">
              <p>
                A global crew of artists, designers, engineers, and filmmakers who don't 
                treat AI like a hack – they treat it like clay, its messy, powerful, and meant 
                to be molded.
              </p>
              <p>
                This collective lives in the guts of it all – the process, the craft, the "what 
                if I break it?" moments. They're not just using Weavy – they're shaping it.
              </p>
              <p className="font-bold text-black pt-2">
                This is the Artist Collective. Earned. Not automated.
              </p>
            </div>
          </div>

          <button className="group flex items-center gap-6 bg-[#1f1f1f] text-white pl-8 pr-2 py-2 rounded-lg hover:bg-black transition-all">
            <span className="text-lg font-light">Apply now</span>
            <div className="bg-white/10 p-2 rounded-md">
              <ArrowRight className="w-5 h-5" />
            </div>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-10 items-start">
          {artists.map((artist, i) => (
            <div key={i} className={`${artist.span} flex flex-col gap-3`}>
              <div className="relative overflow-hidden rounded-lg group">
                <img 
                  src={artist.image} 
                  alt={artist.name} 
                  className="w-full h-full object-cover grayscale-[0.5] hover:grayscale-0 transition-all duration-500" 
                />
                {artist.desc && (
                  <div className={`p-4 ${artist.color} text-black text-[9px] leading-tight font-medium border-t border-black/5`}>
                    {artist.desc}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3 mt-1">
                <img src={artist.avatar} alt={artist.name} className="w-8 h-8 rounded bg-gray-200 object-cover" />
                <div className="flex flex-col justify-center">
                  <h4 className="text-[10px] font-bold uppercase mb-1">{artist.name}</h4>
                  <p className="text-[8px] text-gray-400 uppercase tracking-tight">{artist.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Footer Section (Standard Scale) */}
      <footer className="w-full bg-[#a8b1a2] py-24 px-16 relative overflow-hidden rounded-t-[4rem] mt-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <div className="text-3xl font-bold tracking-tighter flex items-center gap-4 mb-8">
              WEAVY <span className="font-light text-gray-700">| ARTISTIC INTELLIGENCE</span>
            </div>
            <p className="text-sm text-gray-800 max-w-md leading-relaxed opacity-80">
              Weavy is a new way to create. We're bridging the gap between AI capabilities and human creativity, empowering artists to shape the tools of tomorrow.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 text-[11px] uppercase tracking-widest font-bold text-gray-900">
             <div className="flex flex-col gap-4">
               <span className="text-gray-600 font-medium">Get Started</span>
               <a href="#" className="hover:opacity-60 transition-opacity">Pricing</a>
               <a href="#" className="hover:opacity-60 transition-opacity">Enterprise</a>
               <a href="#" className="hover:opacity-60 transition-opacity">Collectives</a>
             </div>
             <div className="flex flex-col gap-4">
               <span className="text-gray-600 font-medium">Resources</span>
               <a href="#" className="hover:opacity-60 transition-opacity">Documentation</a>
               <a href="#" className="hover:opacity-60 transition-opacity">Showcase</a>
               <a href="#" className="hover:opacity-60 transition-opacity">Tutorials</a>
             </div>
             <div className="flex flex-col gap-4">
               <span className="text-gray-600 font-medium">Company</span>
               <a href="#" className="hover:opacity-60 transition-opacity">About</a>
               <a href="#" className="hover:opacity-60 transition-opacity">Careers</a>
               <a href="#" className="hover:opacity-60 transition-opacity">Privacy</a>
             </div>
          </div>
        </div>
        
        {/* Large Floating CTA */}
        <div className="absolute bottom-0 right-0 bg-[#f7ff9e] px-16 py-14 rounded-tl-[4rem] text-7xl font-medium hover:bg-white transition-all duration-500 cursor-pointer select-none">
          Start Now
        </div>
      </footer>
    </div>
  );
}