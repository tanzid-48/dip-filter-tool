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
      <rect width="100" height="100" fill="#DCD3C0" />
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
          stroke="#3F7D5C"
          strokeWidth="3"
        />
      )}
    </svg>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F5F1EA] text-[#211C16] px-4 py-20 flex flex-col items-center gap-16">
      {/* Hero */}
      <div className="w-full max-w-2xl flex flex-col items-center gap-8 text-center">
        <span className="font-mono text-xs text-[#7C7364]">
          CSE 4206 · Digital Image Processing
        </span>

        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight leading-tight">
          Turn a noisy photo
          <br />
          into a clean one.
        </h1>

        {/* Fanned proof strip */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative h-32 w-full max-w-xs flex items-center justify-center"
        >
          <div className="absolute w-20 h-20 -rotate-6 border border-[#E4DED2] bg-white p-1.5 shadow-[0_10px_24px_-8px_rgba(33,28,22,0.3)]">
            <GrainSquare variant="clean" />
            <span className="absolute -bottom-5 left-0 font-mono text-[10px] text-[#7C7364]">
              source
            </span>
          </div>
          <div className="absolute w-20 h-20 border border-[#E4DED2] bg-white p-1.5 shadow-[0_10px_24px_-8px_rgba(33,28,22,0.35)] z-10">
            <GrainSquare variant="noisy" />
            <span className="absolute -bottom-5 left-0 font-mono text-[10px] text-[#7C7364]">
              degraded
            </span>
          </div>
          <div className="absolute w-20 h-20 rotate-6 border border-[#3F7D5C] bg-white p-1.5 shadow-[0_10px_24px_-8px_rgba(33,28,22,0.3)] translate-x-16">
            <GrainSquare variant="restored" />
            <span className="absolute -bottom-5 left-0 font-mono text-[10px] text-[#3F7D5C]">
              restored
            </span>
          </div>
        </motion.div>

        <p className="text-sm text-[#7C7364] leading-relaxed max-w-md pt-4">
          Upload a photo, add noise on purpose, and watch four filters race to
          clean it up — scored and ranked by real PSNR.
        </p>
      </div>

      {/* Stats */}
      <div className="w-full max-w-md grid grid-cols-3 border-y border-[#211C16] py-5">
        <div className="flex flex-col items-center gap-1 border-r border-[#E4DED2]">
          <span className="font-mono text-3xl font-bold">04</span>
          <span className="text-xs text-[#7C7364]">filters</span>
        </div>
        <div className="flex flex-col items-center gap-1 border-r border-[#E4DED2]">
          <span className="font-mono text-3xl font-bold">02</span>
          <span className="text-xs text-[#7C7364]">noise types</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="font-mono text-3xl font-bold">dB</span>
          <span className="text-xs text-[#7C7364]">PSNR scored</span>
        </div>
      </div>

      {/* Paths */}
      <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Link
          href="/bench"
          className="group bg-white border border-[#E4DED2] p-7 flex flex-col gap-3 hover:border-[#211C16] transition-colors shadow-[0_6px_20px_-6px_rgba(33,28,22,0.15)]"
        >
          <span className="font-mono text-xs text-[#7C7364]">01</span>
          <span className="text-xl font-medium">Filter bench</span>
          <span className="text-sm text-[#7C7364] leading-relaxed">
            Upload a photo, add noise on purpose, and run it through Mean,
            Median, Gaussian, and Laplacian filters.
          </span>
          <span className="mt-2 text-sm font-medium group-hover:underline">
            Open bench →
          </span>
        </Link>

        <Link
          href="/filters"
          className="group bg-white border border-[#E4DED2] p-7 flex flex-col gap-3 hover:border-[#211C16] transition-colors shadow-[0_6px_20px_-6px_rgba(33,28,22,0.15)]"
        >
          <span className="font-mono text-xs text-[#7C7364]">02</span>
          <span className="text-xl font-medium">Filter library</span>
          <span className="text-sm text-[#7C7364] leading-relaxed">
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
