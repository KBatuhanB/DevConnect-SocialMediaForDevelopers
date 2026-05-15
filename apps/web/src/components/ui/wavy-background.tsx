"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { createNoise3D } from "simplex-noise";
import { cn } from "../../lib/cn";

type WavyBackgroundProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  className?: string;
  containerClassName?: string;
  colors?: string[];
  waveWidth?: number;
  backgroundFill?: string;
  blur?: number;
  speed?: "slow" | "fast";
  waveOpacity?: number;
};

const defaultWaveColors = ["#38bdf8", "#818cf8", "#c084fc", "#e879f9", "#22d3ee"];

export function WavyBackground({
  children,
  className,
  containerClassName,
  colors,
  waveWidth = 50,
  backgroundFill = "black",
  blur = 10,
  speed = "fast",
  waveOpacity = 0.5,
  ...props
}: WavyBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const noise = useMemo(() => createNoise3D(), []);
  const waveColors = useMemo(() => colors ?? defaultWaveColors, [colors]);
  const [isSafari, setIsSafari] = useState(false);

  function getSpeed() {
    return speed === "slow" ? 0.001 : 0.002;
  }

  useEffect(() => {
    setIsSafari(
      typeof window !== "undefined" &&
        navigator.userAgent.includes("Safari") &&
        !navigator.userAgent.includes("Chrome")
    );
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    let width = 0;
    let height = 0;
    let noiseTime = 0;

    const resize = () => {
      width = context.canvas.width = window.innerWidth;
      height = context.canvas.height = window.innerHeight;
      context.filter = `blur(${blur}px)`;
    };

    const drawWave = (waveCount: number) => {
      noiseTime += getSpeed();

      for (let waveIndex = 0; waveIndex < waveCount; waveIndex += 1) {
        context.beginPath();
        context.lineWidth = waveWidth;
        context.strokeStyle = waveColors[waveIndex % waveColors.length];

        for (let x = 0; x < width; x += 5) {
          const y = noise(x / 800, 0.3 * waveIndex, noiseTime) * 100;
          context.lineTo(x, y + height * 0.5);
        }

        context.stroke();
        context.closePath();
      }
    };

    const render = () => {
      context.fillStyle = backgroundFill;
      context.globalAlpha = waveOpacity;
      context.fillRect(0, 0, width, height);
      drawWave(5);
      animationFrameRef.current = window.requestAnimationFrame(render);
    };

    resize();
    render();
    window.addEventListener("resize", resize);

    return () => {
      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }

      window.removeEventListener("resize", resize);
    };
  }, [backgroundFill, blur, noise, speed, waveColors, waveOpacity, waveWidth]);

  return (
    <div className={cn("wavy-background-root", containerClassName)}>
      <canvas
        className="wavy-background-canvas"
        id="canvas"
        ref={canvasRef}
        style={isSafari ? { filter: `blur(${blur}px)` } : undefined}
      />
      <div className={cn("wavy-background-content", className)} {...props}>
        {children}
      </div>
    </div>
  );
}