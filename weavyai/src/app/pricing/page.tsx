'use client'
import React, { useState } from "react";
import { Plus } from "lucide-react";

// --- Data Constants ---
const creditData = [
  // --- IMAGE MODELS ---
  { model: "Flux Fast", free: 375, starter: 3750, prof: 10000, team: 11250 },
  { model: "Flux Pro", free: 40, starter: 400, prof: 1200, team: 2500 },
  { model: "Stable Diffusion 3.5", free: 120, starter: 1200, prof: 3500, team: 5000 },
  { model: "Midjourney v6.1", free: 15, starter: 150, prof: 500, team: 800 },
  { model: "DALL-E 3", free: 25, starter: 250, prof: 750, team: 1000 },
  
  // --- VIDEO MODELS ---
  { model: "Wan Video (720p)", free: 6, starter: 63, prof: 167, team: 188 },
  { model: "Kling AI (High Quality)", free: 2, starter: 25, prof: 80, team: 120 },
  { model: "Luma Dream Machine", free: 5, starter: 50, prof: 150, team: 200 },
  { model: "Runway Gen-3", free: 3, starter: 30, prof: 100, team: 150 },
  
  // --- VOICE & AUDIO ---
  { model: "ElevenLabs Voice", free: 10, starter: 100, prof: 300, team: 450 },
  { model: "Suno Music v4", free: 4, starter: 40, prof: 120, team: 180 },
  
  // --- UTILITIES ---
  { model: "Upscaling (4K)", free: 50, starter: 500, prof: 1500, team: 2000 },
  { model: "Background Removal", free: 100, starter: 1000, prof: 5000, team: "Unlimited" },
];

const faqs = [
  { 
    q: "How do Weavy credits work?", 
    a: "Credits are the currency of Weavy. Different models have different 'costs' per generation. For example, a fast image generation might cost 1 credit, while a high-definition 4K video could cost 50 credits. Your monthly allowance resets on your billing date." 
  },
  { 
    q: "Do I own the rights to the content I create?", 
    a: "Yes. On all paid plans (Starter, Pro, and Team), you maintain full commercial ownership of any assets you generate. For the Free plan, content is licensed under Creative Commons for non-commercial use only." 
  },
  { 
    q: "What happens if I use all my monthly credits?", 
    a: "If you hit your limit, you can either wait for your monthly reset or purchase 'Credit Top-ups' starting at $10 for 1,000 credits. Pro and Team users also have the option to enable 'Auto-Refill' to ensure creative workflows are never interrupted." 
  },
  { 
    q: "Do unused credits roll over to the next month?", 
    a: "Professional and Team plans include credit rollover up to 2x your monthly allowance. Free and Starter plan credits expire at the end of each billing cycle." 
  },
  { 
    q: "Can I share my credits with my team?", 
    a: "The Team plan features a 'Shared Workspace' where all credits are pooled into a single bucket. Admins can set individual limits for team members to manage usage effectively." 
  },
  { 
    q: "Is my data used to train your AI models?", 
    a: "We value your privacy. Data from Professional and Team accounts is never used to train our base models. For Free and Starter users, we may use anonymized feedback to improve model performance unless you opt-out in settings." 
  },
  { 
    q: "Can I cancel or downgrade my plan at any time?", 
    a: "Yes, you can manage your subscription directly from your dashboard. If you cancel, you will retain access to your paid features until the end of your current billing period." 
  },
  { 
    q: "Do you offer an API for developers?", 
    a: "We do! API access is currently available for Professional and Team plans. You can generate API keys in your account settings and view our documentation at docs.weavy.ai." 
  }
];

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    /* Parent Wrapper with Grid Background:
       - h-full and w-full ensures it covers the viewport.
       - The style object creates a 40px x 40px grid using thin light gray lines.
    */
    <div className="relative min-h-screen w-full bg-[#f8f9fa] overflow-x-hidden"
         style={{
           backgroundImage: `
             linear-gradient(to right, #e5e7eb 1px, transparent 1px),
             linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
           `,
           backgroundSize: '40px 40px'
         }}>
      
      {/* Subtle radial gradient overlay to make the grid fade toward the edges */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#f8f9fa_100%)] pointer-events-none" />

      <div className="relative origin-top scale-[1.5] w-[66.66%] mx-auto text-black font-sans">

       {/* 3. Pricing Cards Section - REDUCED SIZE VERSION */}
       <section className="py-16 border-t border-gray-200">
          <h2 className="text-3xl text-center mb-10 font-medium">Choose your plan</h2>
          
          {/* Constrained max-width to pull cards closer together */}
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-3 px-6">
            {["Free", "Starter", "Professional", "Team"].map((plan, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col hover:shadow-md transition-shadow relative">
                {plan === "Professional" && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#f7ff9e] text-[8px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-black/5">
                    Popular
                  </span>
                )}
                
                <h3 className="text-sm font-bold mb-0.5">{plan}</h3>
                <p className="text-[10px] text-gray-400 mb-4 leading-tight">Basic creative tools.</p>
                
                <div className="text-2xl font-bold mb-4">
                  ${plan === "Free" ? "0" : plan === "Starter" ? "19" : plan === "Professional" ? "36" : "48"}
                  <span className="text-[10px] text-gray-400 font-normal">/mo</span>
                </div>
                
                <button className="w-full bg-black text-white py-2 rounded-md text-[11px] font-medium mb-5 hover:bg-gray-800 transition-colors">
                  {plan === "Free" ? "Start" : "Upgrade"}
                </button>
                
                <ul className="text-[10px] space-y-2 text-gray-500">
                  <li className="flex items-start gap-1.5">
                    <span className="text-black">✓</span> 
                    <span>Access to models</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-black">✓</span> 
                    <span>Editing tools</span>
                  </li>
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* 1. Header Section */}
        <section className="py-20 text-center px-4">
          <div className="flex justify-center mb-6 gap-2">
            <div className="bg-black text-white p-2 rounded">W</div>
            <div className="text-2xl font-bold">× FIGMA</div>
          </div>
          <h2 className="text-sm uppercase tracking-widest mb-2">Weavy is now a part of Figma</h2>
          <p className="text-gray-500 mb-12">Building the future of creative workflows together.</p>
          <h1 className="text-4xl md:text-5xl font-medium max-w-2xl mx-auto leading-tight">
            See exactly what you can produce with each plan's monthly credits
          </h1>
        </section>

        {/* 2. Credit Table Section */}
        <section className="max-w-5xl mx-auto px-4 overflow-x-auto pb-20">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] uppercase text-gray-400">
                <th className="py-4 font-normal">Model</th>
                <th className="py-4 font-normal text-right">Free</th>
                <th className="py-4 font-normal text-right">Starter</th>
                <th className="py-4 font-normal text-right">Professional</th>
                <th className="py-4 font-normal text-right">Team</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              {creditData.map((item, i) => (
                <tr key={i} className="border-t border-gray-200/50">
                  <td className="py-3 text-gray-600">{item.model}</td>
                  <td className="py-3 text-right">{item.free}</td>
                  <td className="py-3 text-right">{item.starter}</td>
                  <td className="py-3 text-right font-medium">{item.prof}</td>
                  <td className="py-3 text-right">{item.team}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* 4. FAQ Section */}
        <section className="bg-[#1a1a1a] text-white py-24">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-4xl text-center mb-16 font-light">Frequently asked questions</h2>
            <div className="space-y-0">
              {faqs.map((faq, i) => (
                <div key={i} className="border-t border-gray-700">
                  <button 
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full py-6 flex justify-between items-center text-left hover:text-gray-300"
                  >
                    <span className="text-sm font-light">{faq.q}</span>
                    <Plus className={`w-4 h-4 transition-transform ${openFaq === i ? 'rotate-45' : ''}`} />
                  </button>
                  {openFaq === i && <div className="pb-6 text-sm text-gray-400 font-light leading-relaxed">{faq.a}</div>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Footer */}
        <footer className="bg-[#a8b1a2] py-20 px-12 relative overflow-hidden rounded-t-[3rem]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="text-2xl font-bold tracking-tighter flex items-center gap-4 mb-6">
                WEAVY <span className="font-light text-gray-600">| ARTISTIC INTELLIGENCE</span>
              </div>
              <p className="text-sm text-gray-700 max-w-md leading-relaxed">
                Weavy is a new way to create. We're bridging the gap between AI capabilities and human creativity.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-[10px] uppercase tracking-widest font-medium">
               <div className="flex flex-col gap-3">
                 <span className="text-gray-500">Get Started</span>
                 <a href="#">Pricing</a>
                 <a href="#">Enterprise</a>
               </div>
            </div>
          </div>
          
          <div className="absolute bottom-0 right-0 bg-[#f7ff9e] p-12 rounded-tl-[3rem] text-6xl font-medium hover:bg-white transition-colors cursor-pointer">
            Start Now
          </div>
        </footer>
      </div>
    </div>
  );
}