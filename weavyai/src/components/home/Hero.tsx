import React, { useEffect, useRef } from "react";

// TypeScript declarations
declare global {
  interface Window {
    gsap: any;
    Draggable: any;
    LeaderLine: any;
  }
}

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        src?: string;
        "camera-controls"?: boolean | string;
        "auto-rotate"?: boolean | string;
        "disable-zoom"?: boolean | string;
        "disable-pan"?: boolean | string;
        "disable-tap"?: boolean | string;
        "shadow-intensity"?: string;
        exposure?: string;
        style?: React.CSSProperties;
      };
    }
  }
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  // Ref to store line instances to clean them up properly
  const linesRef = useRef<any[]>([]);

  useEffect(() => {
    let cleanupFunc: (() => void) | null = null;

    const initHero = () => {
      // 1. Check for libraries
      if (!window.gsap || !window.Draggable || !window.LeaderLine) {
        const timer = setTimeout(initHero, 100);
        cleanupFunc = () => clearTimeout(timer);
        return;
      }

      const { gsap, Draggable, LeaderLine } = window;
      const canvas = canvasRef.current;
      if (!canvas) return;

      const isMobile = window.innerWidth <= 768;

      // 2. Helper to remove old lines
      const clearLines = () => {
        linesRef.current.forEach((line) => {
          try {
            line.remove();
          } catch (e) {
            /* ignore */
          }
        });
        linesRef.current = [];
      };

      // Helper to safely position lines, removing disconnected ones
      const safePositionLines = () => {
        if (!linesRef.current || linesRef.current.length === 0) return;
        
        linesRef.current = linesRef.current.filter((line) => {
          try {
            // Check if line instance is valid
            if (!line || typeof line.position !== 'function') {
              return false;
            }
            
            // Try to position the line - this will throw if elements are disconnected
            line.position();
            return true;
          } catch (e: any) {
            // Silently handle disconnected element errors
            // Only log if it's not the expected "disconnected element" error
            if (e && e.message && !e.message.includes('disconnected')) {
              console.warn('LeaderLine positioning error:', e.message);
            }
            
            // If positioning fails (disconnected element), remove the line
            try {
              if (line && typeof line.remove === 'function') {
                line.remove();
              }
            } catch (removeError) {
              /* ignore removal errors */
            }
            return false;
          }
        });
      };

      // 3. Draw "Strings" (Connections)
      const createConnections = () => {
        clearLines();
        const nodes = canvas.querySelectorAll(".node-connect");

        nodes.forEach((source: any) => {
          const targetString = source.getAttribute("data-connect-to");
          if (!targetString) return;

          targetString.split(",").forEach((id: string) => {
            const target = document.getElementById(id.trim());
            if (!target) return;

            // Specific anchors for that "circuit" look
            const start = source.querySelector(".line-anchor.start");
            const end = target.querySelector(".line-anchor.end");

            if (start && end) {
              try {
                const line = new LeaderLine(start, end, {
                  color: "#d1d5db", // Light gray (Tailwind gray-300)
                  size: 2,
                  path: "magnet", // This creates the smooth curved "string" effect
                  startSocket: "right",
                  endSocket: "left",
                  startPlug: "disc",
                  startPlugSize: 3,
                  startPlugColor: "#ffffff",
                  startPlugOutline: true,
                  endPlug: "disc",
                  endPlugSize: 3,
                  endPlugColor: "#ffffff",
                  endPlugOutline: true,
                  hide: true, // Hidden initially until positioned
                });
                linesRef.current.push(line);
              } catch (e) {
                console.warn(e);
              }
            }
          });
        });

        // Show lines after creation
        linesRef.current.forEach((l) => {
          try {
            if (l && typeof l.show === 'function') {
              l.show();
            }
          } catch (e) {
            // Silently handle errors when showing lines
          }
        });
      };

      // 4. "Figma-like" Drag Interaction
      const setupDraggables = () => {
        const draggables = canvas.querySelectorAll(".node-connect");

        if (!isMobile) {
          draggables.forEach((el: any) => {
            // Kill existing instance if any
            if (Draggable.get(el)) Draggable.get(el).kill();

            Draggable.create(el, {
              type: "x,y",
              bounds: canvas,
              inertia: true,
              edgeResistance: 0.65,
              zIndexBoost: false, // We handle z-index manually
              onPress() {
                el.style.cursor = "grabbing";
                gsap.to(el, {
                  scale: 1.02,
                  zIndex: 50,
                  duration: 0.2,
                  ease: "power2.out",
                });
              },
              onRelease() {
                el.style.cursor = "grab";
                gsap.to(el, { scale: 1, zIndex: 10, duration: 0.2 });
              },
              onDrag() {
                safePositionLines();
              },
              onThrowUpdate() {
                safePositionLines();
              },
            });
          });
        }
      };

      // Initialize
      createConnections();
      setupDraggables();

      // Force position update after a slight delay to ensure DOM layout is settled
      setTimeout(() => safePositionLines(), 100);

      const handleResize = () => {
        createConnections();
        setupDraggables();
      };
      
      // Debounce scroll handler to reduce calls
      let scrollTimeout: NodeJS.Timeout | null = null;
      const handleScroll = () => {
        if (scrollTimeout) {
          clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(() => {
          safePositionLines();
        }, 16); // ~60fps
      };

      window.addEventListener("resize", handleResize);
      window.addEventListener("scroll", handleScroll, true); // Capture scroll

      cleanupFunc = () => {
        clearLines();
        if (scrollTimeout) {
          clearTimeout(scrollTimeout);
        }
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("scroll", handleScroll, true);
        const draggables = window.Draggable?.get(
          canvas.querySelectorAll(".node-connect")
        );
        if (Array.isArray(draggables)) draggables.forEach((d: any) => d.kill());
      };
    };

    initHero();
    return () => {
      if (cleanupFunc) cleanupFunc();
    };
  }, []);

  // --- STYLES ---
  const imageCardStyle =
    "node-connect absolute rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-white border border-gray-100 cursor-grab active:cursor-grabbing transition-shadow duration-200 hover:shadow-[0_20px_40px_rgb(0,0,0,0.15)]";

  // Anchors - positioned exactly on the edge
  const anchorStart = "line-anchor start absolute w-3 h-3 bg-white rounded-full top-1/2 -right-1.5 border-[2.5px] border-white z-20 box-content";
const anchorEnd = "line-anchor end absolute w-3 h-3 bg-white rounded-full top-1/2 -left-1.5 border-[2.5px] border-white z-20 box-content";

  return (
    <section
      className="relative w-full h-screen bg-[#f8f9fa] text-gray-900 overflow-hidden flex flex-col pt-16"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif',
      }}
    >
 {/* 1. TOP HEADER SECTION (Static - Prevents overlap) */}
<div className="relative z-10 w-full px-8 py-8 md:py-12 shrink-0 pointer-events-none">
  <div className="grid grid-cols-1 md:grid-cols-3 items-start">

    {/* Left: Logo */}
    <div className="flex items-start">
      <h1 className="text-[80px] font-normal tracking-tight text-gray-900 leading-[1.02]">
        Weavy
      </h1>
    </div>

    {/* Center: Headline + text */}
    <div className="text-left md:text-center">
      <h2 className="text-[80px] font-normal tracking-tight text-gray-900 leading-[1.02] whitespace-nowrap">
        Artistic Intelligence
      </h2>

      <p className="mt-6 text-[15px] text-gray-600 leading-[1.6] font-normal">
        Turn your creative vision into scalable workflows.
        <br />
        Access all AI models and professional editing tools
        <br />
        in one node based platform.
      </p>
    </div>

    {/* Right spacer */}
    <div className="hidden md:block" />

  </div>
</div>




      {/* 2. INTERACTIVE CANVAS SECTION (Takes remaining space) */}
      <div
        className="flex-1 w-full relative overflow-hidden"
        ref={containerRef}
      >
        {/* The Whiteboard Container */}
        <div
          ref={canvasRef}
          className="absolute inset-4 md:inset-x-8 md:bottom-8 md:top-0 bg-white/40 backdrop-blur-xl rounded-[2rem] border border-white/60 shadow-xl overflow-hidden"
          style={{
            // CSS Grid pattern similar to Figma
            backgroundImage: `
              linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        >
          {/* Subtle inner shadow for depth */}
          <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_60px_rgba(255,255,255,0.5)] rounded-[2rem]"></div>

          {/* --- Node 1: 3D Rodin --- */}
          <div
            id="node1"
            className={`${imageCardStyle} w-[180px]`}
            style={{ top: "15%", left: "8%" }}
            data-connect-to="node3"
          >
            <div className={anchorStart}></div>



            <div className="w-full h-[200px] bg-[#e2e5e9] relative">
              <model-viewer
                src="https://cdn.jsdelivr.net/gh/kshach/nbd/3D%20Model%20First%20Fold.glb"
                camera-controls
                auto-rotate
                disable-zoom
                disable-pan
                disable-tap
                shadow-intensity="1"
                exposure="1.2"
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          </div>

          {/* --- Node 2: Color Reference --- */}
          <div
            id="node2"
            className={`${imageCardStyle} w-[240px]`}
            style={{ top: "65%", left: "5%" }}
            data-connect-to="node3"
          >
            <div className={anchorStart}></div>

            

            <img
              src="https://cdn.prod.website-files.com/681b040781d5b5e278a69989/681cd77722078ff43fe428f3_hcard-color%20reference.avif"
              className="w-full h-auto pointer-events-none"
              alt="color ref"
            />
          </div>

          {/* --- Node 3: Stable Diffusion (Center) --- */}
          <div
            id="node3"
            className={`${imageCardStyle} w-[340px]`}
            style={{ top: "30%", left: "30%" }}
            data-connect-to="node4,node5"
          >
            <div className={anchorEnd}></div>
            <div className={anchorStart}></div>

            

            <img
              src="https://cdn.prod.website-files.com/681b040781d5b5e278a69989/681cd7cbc22419b32bb9d8d8_hcard%20-%20STABLE%20DIFFUSION.avif"
              className="w-full h-auto pointer-events-none block"
              alt="diffusion result"
            />
          </div>

          {/* --- Node 4: Text Prompt --- */}
          <div
            id="node4"
            className={`${imageCardStyle} w-[260px] !bg-white`}
            style={{ top: "10%", left: "62%" }}
            data-connect-to="node6"
          >
            <div className={anchorEnd}></div>
            <div className={anchorStart}></div>

            

            <div className="p-6 pt-10 pb-8">
              <p className="text-[13px] text-gray-500 leading-relaxed font-medium">
                a Great-Tailed Grackle bird is flying from the background and
                seating on the model's shoulder slowly and barely moves. the
                model looks at the camera, then bird flies away. cinematic.
              </p>
            </div>
          </div>

          {/* --- Node 5: Flux Bird --- */}
          <div
            id="node5"
            className={`${imageCardStyle} w-[220px]`}
            style={{ top: "60%", left: "58%" }}
            data-connect-to="node6"
          >
            <div className={anchorEnd}></div>
            <div className={anchorStart}></div>

            

            <img
              src="https://cdn.prod.website-files.com/681b040781d5b5e278a69989/6837510acbe777269734b387_bird_desktop.avif"
              className="w-full h-auto pointer-events-none block"
              alt="flux bird"
            />
          </div>

          <div
  id="node6"
  className={`${imageCardStyle} w-[340px] h-[460px]`} // same size
  style={{ top: "15%", left: "85%" }}
>
  <div className={anchorEnd}></div>

  <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
    <span className="text-[10px] font-bold text-gray-800 uppercase">
      VIDEO
    </span>
    <span className="text-[10px] font-bold text-gray-500 uppercase">
      MINIMAX VIDEO
    </span>
  </div>

  <video
    src="https://assets.weavy.ai/homepage/hero/hero_video_mobile_342px.mp4"
    className="w-full h-full object-cover pointer-events-none block"
    autoPlay
    muted
    loop
    playsInline
  />
</div>

        </div>
      </div>
    </section>
  );
}
