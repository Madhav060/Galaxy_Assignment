import React from 'react';

export default function WeavyEnterprise() {
  return (
    <div className="min-h-screen bg-transparent">
 
      {/* 1. Hero Section - Margin Removed, Clear Background */}
      <section className="relative h-[85vh] flex items-center justify-center text-black overflow-hidden">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        >
          <source src="https://assets.weavy.ai/enterprise_page/enterprise_video_desktop.mp4" type="video/mp4" />
        </video>
        
        {/* No Overlay - Video is completely clear */}
        
        <div className="relative z-10 text-center px-4 max-w-5xl">
          <h1 className="text-5xl md:text-8xl font-medium mb-6 leading-[0.85] tracking-tighter">
            Turn your <span className="text-orange-500">creative team</span><br />
            into an AI-first powerhouse
          </h1>
          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto font-light text-gray-900 leading-relaxed">
            Weavy enables enterprise design teams to adopt AI at scale — combining models, editing tools, and workflows in one professional platform.
          </p>
          <button className="bg-black text-white px-10 py-4 rounded-full font-medium text-lg hover:scale-105 transition-transform shadow-2xl">
            Contact Sales
          </button>
        </div>
      </section>

      {/* 2. Enterprise Power Section - Transparent & Glassmorphism */}
      <section className="py-32 px-4 bg-transparent">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-medium mb-20 text-center tracking-tight leading-tight">
            Enterprise power. <br/>
            <span className="opacity-40">Creative control.</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-10">
            {/* Card 1 */}
            <div className="bg-white/40 backdrop-blur-md border border-white/20 p-10 rounded-[2.5rem] hover:bg-white/60 transition-all duration-500">
              <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </div>
              <h3 className="text-2xl font-medium mb-6 leading-tight">All your AI tools, one visual canvas</h3>
              <ul className="space-y-4 text-[13px] text-gray-700 leading-relaxed">
                <li className="flex gap-2"><span>•</span> Use any model — image, video, 3D — in one place</li>
                <li className="flex gap-2"><span>•</span> One subscription covers all models and future releases</li>
                <li className="flex gap-2"><span>•</span> Shared credit pool across team members</li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="bg-white/40 backdrop-blur-md border border-white/20 p-10 rounded-[2.5rem] hover:bg-white/60 transition-all duration-500">
              <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343" />
                </svg>
              </div>
              <h3 className="text-2xl font-medium mb-6 leading-tight">Production-grade creative control</h3>
              <ul className="space-y-4 text-[13px] text-gray-700 leading-relaxed">
                <li className="flex gap-2"><span>•</span> Edit with layers, masks, and color-grading tools</li>
                <li className="flex gap-2"><span>•</span> Stay on-brand with scalable design systems</li>
                <li className="flex gap-2"><span>•</span> Turn complex workflows into simple apps</li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="bg-white/40 backdrop-blur-md border border-white/20 p-10 rounded-[2.5rem] hover:bg-white/60 transition-all duration-500">
              <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9" />
                </svg>
              </div>
              <h3 className="text-2xl font-medium mb-6 leading-tight">Built for enterprise adoption</h3>
              <ul className="space-y-4 text-[13px] text-gray-700 leading-relaxed">
                <li className="flex gap-2"><span>•</span> Enterprise-grade privacy, security, and indemnity</li>
                <li className="flex gap-2"><span>•</span> Trace every asset back to its legal source</li>
                <li className="flex gap-2"><span>•</span> Priority Slack support and team workshops</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Footer with Signature Start Now Notch */}
      <footer className="w-full bg-[#a8b1a2] py-24 px-16 relative overflow-hidden rounded-t-[5rem]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <div className="text-3xl font-bold tracking-tighter flex items-center gap-4 mb-8 text-black">
              WEAVY <span className="font-light text-black/60">| ARTISTIC INTELLIGENCE</span>
            </div>
            <p className="text-sm text-black/80 max-w-md leading-relaxed">
              Transforming the tradition of craft through Artistic Intelligence. Built for teams that refuse to compromise on quality.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 text-[11px] uppercase tracking-widest font-bold text-gray-900">
             <div className="flex flex-col gap-4">
               <span className="opacity-40 font-medium">Get Started</span>
               <a href="#" className="hover:underline">Pricing</a>
               <a href="#" className="hover:underline">Enterprise</a>
             </div>
             <div className="flex flex-col gap-4">
               <span className="opacity-40 font-medium">Connect</span>
               <a href="#" className="hover:underline">LinkedIn</a>
               <a href="#" className="hover:underline">Instagram</a>
             </div>
          </div>
        </div>
        
        {/* Large "Start Now" Yellow Notch Button */}
        <div className="absolute bottom-0 right-0 bg-[#f7ff9e] px-24 py-16 rounded-tl-[5rem] text-7xl font-medium hover:bg-white transition-all duration-700 cursor-pointer select-none border-l border-t border-black/5 active:scale-95 origin-bottom-right">
          Start Now
        </div>
      </footer>
    </div>
  );
}