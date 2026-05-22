"use client";

import React, { useId } from "react";
import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import type { Container, SingleOrMultiple } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";
import { cn } from "@/lib/utils";
import { motion, useAnimation } from "framer-motion";

type ParticlesProps = {
  id?: string;
  className?: string;
  background?: string;
  particleSize?: number;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  particleColor?: string;
  particleDensity?: number;
};

export const SparklesCore = (props: ParticlesProps) => {
  const { id, className, background, minSize, maxSize, speed, particleColor, particleDensity } = props;
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => { setInit(true); });
  }, []);

  const controls = useAnimation();

  const particlesLoaded = async (container?: Container) => {
    if (container) {
      controls.start({ opacity: 1, transition: { duration: 1 } });
    }
  };

  const generatedId = useId();

  return (
    <motion.div animate={controls} className={cn("opacity-0", className)}>
      {init && (
        <Particles
          id={id || generatedId}
          className={cn("h-full w-full")}
          particlesLoaded={particlesLoaded}
          options={{
            background: { color: { value: background || "transparent" } },
            fullScreen: { enable: false, zIndex: 1 },
            fpsLimit: 120,
            interactivity: {
              events: {
                onClick: { enable: true, mode: "push" },
                onHover: { enable: false, mode: "repulse" },
                resize: true as unknown as { delay: number },
              },
              modes: {
                push: { quantity: 4 },
                repulse: { distance: 200, duration: 0.4 },
              },
            },
            particles: {
              bounce: { horizontal: { value: 1 }, vertical: { value: 1 } },
              collisions: { enable: false, mode: "bounce", overlap: { enable: true, retries: 0 }, absorb: { speed: 2 }, bounce: { horizontal: { value: 1 }, vertical: { value: 1 } }, maxSpeed: 50 },
              color: { value: particleColor || "#ffffff" },
              move: {
                enable: true,
                direction: "none",
                random: false,
                straight: false,
                outModes: { default: "out" },
                speed: { min: 0.1, max: 1 },
              },
              number: {
                density: { enable: true, width: 400, height: 400 },
                limit: { mode: "delete", value: 0 },
                value: particleDensity || 120,
              },
              opacity: {
                value: { min: 0.1, max: 1 },
                animation: { enable: true, speed: speed || 4, sync: false, mode: "auto", startValue: "random", destroy: "none", count: 0, decay: 0, delay: 0 },
              },
              shape: { type: "circle", close: true, fill: true, options: {} },
              size: {
                value: { min: minSize || 1, max: maxSize || 3 },
                animation: { enable: false, speed: 5, sync: false, mode: "auto", startValue: "random", destroy: "none", count: 0, decay: 0, delay: 0 },
              },
              stroke: { width: 0 },
              zIndex: { value: 0, opacityRate: 1, sizeRate: 1, velocityRate: 1 },
              effect: { close: true, fill: true, options: {}, type: {} as SingleOrMultiple<string> | undefined },
              groups: {},
              reduceDuplicates: false,
              shadow: { enable: false, blur: 0, color: { value: "#000" }, offset: { x: 0, y: 0 } },
            },
            detectRetina: true,
          }}
        />
      )}
    </motion.div>
  );
};
