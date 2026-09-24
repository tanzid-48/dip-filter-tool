"use client";

import Link from "next/link";
import { motion } from "framer-motion";

function GrainSquare({ variant }: { variant: "clean" | "noisy" | "restored" }) {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <filter id={`grain-${variant}`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="2"
            result="noise"
          />
          <feColorMatrix
            in="noise"
            type="matrix"
            values="0 0 0 0 0.13  0 0 0 0 0.11  0 0 0 0 0.09  0 0 0 0.4 0"
          />
        </filter>
      </defs>
      <rect width="100" height="100" fill="var(--lab-hairline)" />
      {variant !== "clean" && (
        <rect
          width="100"
          height="100"
          filter={`url(#grain-${variant})`}
          opacity={variant === "noisy" ? 0.95 : 0.22}
        />
      )}
      {variant === "restored" && (
        <rect
          width="100"
          height="100"
          fill="none"
          stroke="var(--lab-good)"
          strokeWidth="3"
        />
      )}
    </svg>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[var(--lab-bg)] text-[var(--lab-ink)] px-4 py-20 flex flex-col items-center gap-16">
      <div className="w-full max-w-2xl flex flex-col items-center gap-8 text-center">
        <span className="font-mono text-xs text-[var(--lab-muted)]">
          CSE 4206 · Digital Image Processing
        </span>

        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight leading-tight">
          Turn a noisy photo
          <br />
          into a clean one.
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative h-32 w-full max-w-xs flex items-center justify-center"
        >
          <div className="absolute w-20 h-20 -rotate-6 border border-[var(--lab-hairline)] bg-[var(--lab-surface)] p-1.5 shadow-[0_10px_24px_-8px_rgba(0,0,0,0.3)]">
            <GrainSquare variant="clean" />
            <span className="absolute -bottom-5 left-0 font-mono text-[10px] text-[var(--lab-muted)]">
              source
            </span>
          </div>
          <div className="absolute w-20 h-20 border border-[var(--lab-hairline)] bg-[var(--lab-surface)] p-1.5 shadow-[0_10px_24px_-8px_rgba(0,0,0,0.35)] z-10">
            <GrainSquare variant="noisy" />
            <span className="absolute -bottom-5 left-0 font-mono text-[10px] text-[var(--lab-muted)]">
              degraded
            </span>
          </div>
          <div className="absolute w-20 h-20 rotate-6 border border-[var(--lab-good)] bg-[var(--lab-surface)] p-1.5 shadow-[0_10px_24px_-8px_rgba(0,0,0,0.3)] translate-x-16">
            <GrainSquare variant="restored" />
            <span className="absolute -bottom-5 left-0 font-mono text-[10px] text-[var(--lab-good)]">
              restored
            </span>
          </div>
        </motion.div>

        <p className="text-sm text-[var(--lab-muted)] leading-relaxed max-w-md pt-4">
          Upload a photo, add noise on purpose, and watch four filters race to
          clean it up — scored and ranked by real PSNR.
        </p>
      </div>

      <div className="w-full max-w-md grid grid-cols-3 border-y border-[var(--lab-ink)] py-5">
        <div className="flex flex-col items-center gap-1 border-r border-[var(--lab-hairline)]">
          <span className="font-mono text-3xl font-bold">04</span>
          <span className="text-xs text-[var(--lab-muted)]">filters</span>
        </div>
        <div className="flex flex-col items-center gap-1 border-r border-[var(--lab-hairline)]">
          <span className="font-mono text-3xl font-bold">02</span>
          <span className="text-xs text-[var(--lab-muted)]">noise types</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="font-mono text-3xl font-bold">dB</span>
          <span className="text-xs text-[var(--lab-muted)]">PSNR scored</span>
        </div>
      </div>

      <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Link
          href="/bench"
          className="group bg-[var(--lab-surface)] border border-[var(--lab-hairline)] p-7 flex flex-col gap-3 hover:border-[var(--lab-ink)] transition-colors shadow-[0_6px_20px_-6px_rgba(0,0,0,0.15)]"
        >
          <span className="font-mono text-xs text-[var(--lab-muted)]">01</span>
          <span className="text-xl font-medium">Filter bench</span>
          <span className="text-sm text-[var(--lab-muted)] leading-relaxed">
            Upload a photo, add noise on purpose, and run it through Mean,
            Median, Gaussian, and Laplacian filters.
          </span>
          <span className="mt-2 text-sm font-medium group-hover:underline">
            Open bench →
          </span>
        </Link>

        <Link
          href="/filters"
          className="group bg-[var(--lab-surface)] border border-[var(--lab-hairline)] p-7 flex flex-col gap-3 hover:border-[var(--lab-ink)] transition-colors shadow-[0_6px_20px_-6px_rgba(0,0,0,0.15)]"
        >
          <span className="font-mono text-xs text-[var(--lab-muted)]">02</span>
          <span className="text-xl font-medium">Filter library</span>
          <span className="text-sm text-[var(--lab-muted)] leading-relaxed">
            Read the theory, kernel, formula, and exam-style answers for every
            filter used in the bench.
          </span>
          <span className="mt-2 text-sm font-medium group-hover:underline">
            Open library →
          </span>
        </Link>
      </div>
    </main>
  );
}
