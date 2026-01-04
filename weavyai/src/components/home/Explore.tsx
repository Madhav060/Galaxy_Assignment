import React from "react";
import { Linkedin, Instagram, Youtube } from 'lucide-react';

type Workflow = {
  title: string;
  image: string;
};

const workflows: Workflow[] = [
  {
    title: "Wan Lora – Rotate",
    image:
      "https://cdn.prod.website-files.com/681b040781d5b5e278a69989/6825b0acc901ee5c718efc90_Wan%20Lora%20-%20Rotate.avif",
  },
  {
    title: "Multiple Models",
    image:
      "https://cdn.prod.website-files.com/681b040781d5b5e278a69989/681f925d9ecbfaf69c5dc15e_Workflow%2001.avif",
  },
  {
    title: "Wan LoRa Inflate",
    image:
      "https://cdn.prod.website-files.com/681b040781d5b5e278a69989/681f925d9ecbfaf69c5dc164_Workflow%2003.avif",
  },
  {
    title: "ControlNet – Structure",
    image:
      "https://cdn.prod.website-files.com/681b040781d5b5e278a69989/681f925d9ecbfaf69c5dc16a_Workflow%2002.avif",
  },
];

const ExploreWorkflows: React.FC = () => {
  return (
    <>
      <section className="bg-[#2d2d2d] text-white py-20 px-8 mb-20">
        <div className="max-w-[1600px] mx-auto">
          {/* Header */}
          <div className="max-w-3xl mb-20">
            <h2 className="text-7xl font-light leading-[1.1] mb-8">
              Explore Our <br /> Workflows
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              From multi-layer compositing to matte manipulation, Weavy keeps up
              with your creativity with all the editing tools you recognize and
              rely on.
            </p>
          </div>

          {/* Workflows Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflows.map((workflow, index) => (
              <div key={index} className="flex flex-col">
                {/* Title */}
                <h3 className="text-white text-lg font-normal mb-5">
                  {workflow.title}
                </h3>
                
                {/* Card */}
                <div className="relative w-full h-[272px] overflow-hidden rounded-2xl bg-[#3a3a3a] group">
                  <img
                    src={workflow.image}
                    alt={workflow.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <button className="absolute bottom-5 left-5 bg-[#d4ff00] text-black text-sm font-semibold px-5 py-2 rounded-lg hover:bg-[#c0eb00] transition-colors">
                    Try
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-screen bg-[#AEB3A9] relative overflow-hidden">
        <div className="relative z-10 h-full flex flex-col">
          {/* Header */}
          <header className="px-8 pt-12">
            <div className="flex items-center gap-3 max-w-7xl mx-auto">
              <div className="text-white text-3xl font-bold">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <rect x="0" y="0" width="8" height="8" fill="white" />
                  <rect x="0" y="16" width="8" height="8" fill="white" />
                  <rect x="0" y="32" width="8" height="8" fill="white" />
                  <rect x="16" y="16" width="8" height="8" fill="white" />
                  <rect x="16" y="32" width="8" height="8" fill="white" />
                </svg>
              </div>
              <div>
                <div className="text-white text-xl font-light tracking-wide">
                  WEAVY
                </div>
              </div>
              <div className="h-8 w-px bg-white/30 mx-2"></div>
              <div className="text-white text-sm font-light tracking-wider">
                ARTISTIC<br />INTELLIGENCE
              </div>
            </div>
          </header>

          {/* Main Content - Centered */}
          <main className="flex-1 flex items-center justify-center px-8">
            <div className="max-w-7xl mx-auto w-full">
              <div className="flex items-center gap-8 mb-12">
              <h1 className="text-white text-7xl font-light leading-tight">
                Artificial<br />
                Intelligence
              </h1>
              <span className="text-white text-6xl font-light">+</span>
              <h1 className="text-white text-7xl font-light leading-tight">
                Human<br />
                Creativity
              </h1>
                          </div>

              <p className="text-white/80 text-base max-w-xl leading-relaxed">
                Weavy is a new way to create. We're bridging the gap between
                AI capabilities and human creativity, to continue the tradition
                of craft in artistic expression. We call it Artistic Intelligence.
              </p>
            </div>
          </main>

          {/* Footer */}
          <footer className="px-8 pb-12">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-4 gap-12 mb-8">
              <div>
                <h3 className="text-white/60 text-sm mb-4 font-light">Get Started</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-white text-sm hover:text-white/80">REQUEST A DEMO</a></li>
                  <li><a href="#" className="text-white text-sm hover:text-white/80">PRICING</a></li>
                  <li><a href="#" className="text-white text-sm hover:text-white/80">ENTERPRISE</a></li>
                </ul>
              </div>

              <div>
                <h3 className="text-white/60 text-sm mb-4 font-light">Company</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-white text-sm hover:text-white/80">ABOUT</a></li>
                  <li><a href="#" className="text-white text-sm hover:text-white/80">CAREERS</a></li>
                  <li><a href="#" className="text-white text-sm hover:text-white/80">TRUST</a></li>
                  <li><a href="#" className="text-white text-sm hover:text-white/80">TERMS</a></li>
                  <li><a href="#" className="text-white text-sm hover:text-white/80">PRIVACY</a></li>
                </ul>
              </div>

              <div>
                <h3 className="text-white/60 text-sm mb-4 font-light">Connect</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-white text-sm hover:text-white/80">COLLECTIVE</a></li>
                </ul>
              </div>

              <div>
                <h3 className="text-white/60 text-sm mb-4 font-light">Resources</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-white text-sm hover:text-white/80">KNOWLEDGE CENTER</a></li>
                </ul>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex gap-6 mb-8">
              <a href="#" className="text-white hover:text-white/80">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-white hover:text-white/80">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-white hover:text-white/80">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" className="text-white hover:text-white/80">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </a>
              <a href="#" className="text-white hover:text-white/80">
                <Youtube size={20} />
              </a>
            </div>

            {/* Security Badge */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <div className="text-white text-xs font-mono">SOC<br/>2</div>
              </div>
              <div>
                <div className="text-white text-xs">SOC 2 Type II Certified</div>
                <div className="text-white/60 text-xs">Your data is protected with industry-standard security controls.</div>
              </div>
            </div>

            {/* Copyright */}
            <div className="text-white/60 text-xs tracking-wider">
              WEAVY © 2025. ALL RIGHTS RESERVED.
            </div>
            </div>
          </footer>
        </div>

        {/* Start Now Button */}
        <button className="absolute bottom-0 right-0 bg-[#e8f4a3] text-black text-5xl font-light px-16 py-8 hover:bg-[#dde994] transition-colors">
          Start Now
        </button>
      </div>
    </>
  );
};

export default ExploreWorkflows;