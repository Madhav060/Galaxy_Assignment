"use client";
import React, { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Hero from '@/components/home/Hero';
import ModelsSection from '@/components/home/ModelsSection';
import WorkflowSection from '@/components/home/WorkflowSection';
import OutcomeSection from '@/components/home/OutcomeSection';
import ExploreWorkflows from '@/components/home/Explore';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function WeavyPage() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 0.9,
      gestureOrientation: 'vertical',
      wrapper: document.documentElement,
      content: document.body,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Prevent clipping
    document.documentElement.style.overflowX = 'hidden';
    document.body.style.overflowX = 'hidden';
    document.body.style.overflowY = 'visible';

    return () => {
      lenis.destroy();
      document.documentElement.style.overflowX = '';
      document.body.style.overflowX = '';
      document.body.style.overflowY = '';
    };
  }, []);

  return (
    <>
      <Hero />
      <ModelsSection />
      <WorkflowSection />
      <ExploreWorkflows />
    </>
  );
}
