"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Hero from "@/components/home/Hero";
import ModelsSection from "@/components/home/ModelsSection";
import WorkflowSection from "@/components/home/WorkflowSection";
import ExploreWorkflows from "@/components/home/Explore";
import OutcomeSection from "@/components/home/OutcomeSection";

gsap.registerPlugin(ScrollTrigger);

export default function Page() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 0.9,
    });

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    document.documentElement.style.overflowX = "hidden";
    document.body.style.overflowX = "hidden";

    return () => {
      lenis.destroy();
      document.documentElement.style.overflowX = "";
      document.body.style.overflowX = "";
    };
  }, []);

  return (
    <>
      <Hero />
      <ModelsSection />
      <WorkflowSection />
      <OutcomeSection />
      <ExploreWorkflows />
    </>
  );
}
