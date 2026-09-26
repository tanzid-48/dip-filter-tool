"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AnalysisResponse, ExplainResponse } from "@/types/analysis";

type FilterKey = "mean" | "median" | "gaussian" | "laplacian" | "bilateral";

const FILTER_LABEL: Record<FilterKey, string> = {
  mean: "Mean",
  median: "Median",
  gaussian: "Gaussian",
  laplacian: "Laplacian",
  bilateral: "Bilateral",
};

const PRINT_SHADOW = "shadow-[0_6px_20px_-6px_rgba(0,0,0,0.22)]";

export default function BenchPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [noiseType, setNoiseType] = useState<string>("none");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [explainLoading, setExplainLoading] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
      setExplanation(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setExplanation(null);
    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("noise_type", noiseType);

    try {
      const response = await fetch("http://127.0.0.1:5000/analyze", {
        method: "POST",
        body: formData,
      });
      const data: AnalysisResponse = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExplain = async () => {
    if (!result) return;

    setExplainLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recommendation: result.recommendation,
          psnr: result.psnr,
          ssim: result.ssim,
        }),
      });
      const data: ExplainResponse = await response.json();
      setExplanation(data.explanation);
    } catch (error) {
      console.error("Explain failed:", error);
    } finally {
      setExplainLoading(false);
    }
  };

  const filterFrames: {
    key: FilterKey;
    psnr: number;
    ssim: number;
    image: string;
  }[] = result
    ? [
        {
          key: "mean",
          psnr: result.psnr.mean,
          ssim: result.ssim.mean,
          image: result.images.mean,
        },
        {
          key: "median",
          psnr: result.psnr.median,
          ssim: result.ssim.median,
          image: result.images.median,
        },
        {
          key: "gaussian",
          psnr: result.psnr.gaussian,
          ssim: result.ssim.gaussian,
          image: result.images.gaussian,
        },
        {
          key: "laplacian",
          psnr: result.psnr.laplacian,
          ssim: result.ssim.laplacian,
          image: result.images.laplacian,
        },
        {
          key: "bilateral",
          psnr: result.psnr.bilateral,
          ssim: result.ssim.bilateral,
          image: result.images.bilateral,
        },
      ]
    : [];

  const bestKey = filterFrames.length
    ? filterFrames.reduce((best, current) =>
        current.psnr > best.psnr ? current : best,
      ).key
    : null;

  const isGoodQuality =
    result?.recommendation.recommendation.includes("No major issues");

  return (
    <main className="min-h-screen bg-[var(--lab-bg)] text-[var(--lab-ink)] px-4 py-20 flex flex-col items-center gap-14 font-sans">
      <div className="w-full max-w-md flex flex-col gap-2">
        <div className="flex items-baseline justify-between border-b-2 border-[var(--lab-ink)] pb-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Filter bench
          </h1>
          <span className="font-mono text-xs text-[var(--lab-muted)]">
            CSE 4206 lab
          </span>
        </div>
        <p className="text-sm text-[var(--lab-muted)] leading-relaxed">
          Drop in a photo, add noise on purpose, and see which filter cleans it
          up best — read the PSNR to know for sure.
        </p>
      </div>

      <div
        className={`w-full max-w-md bg-[var(--lab-surface)] border border-[var(--lab-hairline)] ${PRINT_SHADOW}`}
      >
        <div className="p-6 flex flex-col gap-5">
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[var(--lab-hairline)] p-10 cursor-pointer transition-colors hover:border-[var(--lab-ink)] focus-within:border-[var(--lab-ink)]"
          >
            <span className="text-sm font-medium">
              {selectedFile
                ? selectedFile.name
                : "Drop a photo or click to choose"}
            </span>
            <span className="text-xs text-[var(--lab-muted)]">JPG or PNG</span>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="sr-only"
            />
          </label>

          {previewUrl && (
            <div className="relative w-full aspect-square border border-[var(--lab-hairline)] overflow-hidden bg-[var(--lab-bg)]">
              <Image
                src={previewUrl}
                alt="Preview"
                fill
                unoptimized
                className="object-contain"
              />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="noise-select"
              className="text-sm text-[var(--lab-muted)]"
            >
              Add noise
            </label>
            <Select
              value={noiseType}
              onValueChange={(value) => {
                if (value) setNoiseType(value);
              }}
            >
              <SelectTrigger
                id="noise-select"
                className="w-full rounded-none border-[var(--lab-hairline)] h-11"
              >
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="gaussian">Gaussian</SelectItem>
                <SelectItem value="salt_pepper">Salt & pepper</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleAnalyze}
            disabled={!selectedFile || loading}
            className="w-full h-12 rounded-none bg-[var(--lab-ink)] text-[var(--lab-bg)] hover:opacity-85 text-base"
          >
            {loading ? "Running…" : "Run filters"}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.4 }}
            className="w-full max-w-5xl flex flex-col gap-14"
          >
            <div
              className={`relative border border-[var(--lab-hairline)] bg-[var(--lab-surface)] p-7 ${PRINT_SHADOW}`}
            >
              <span
                className={`absolute -top-4 left-7 rotate-[-4deg] border-2 bg-[var(--lab-surface)] px-3 py-1 text-xs font-semibold tracking-wide shadow-sm ${
                  isGoodQuality
                    ? "border-[var(--lab-good)] text-[var(--lab-good)]"
                    : "border-[var(--lab-bad)] text-[var(--lab-bad)]"
                }`}
              >
                {isGoodQuality ? "clean" : "needs cleanup"}
              </span>
              <p className="mt-2 text-lg font-medium">
                {result.recommendation.recommendation}
              </p>
              <dl className="mt-5 grid grid-cols-3 gap-6">
                <div>
                  <dt className="text-xs text-[var(--lab-muted)]">
                    noise type
                  </dt>
                  <dd className="font-mono text-base font-medium">
                    {result.recommendation.noise_type}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-[var(--lab-muted)]">
                    noise score
                  </dt>
                  <dd className="font-mono text-base font-medium">
                    {result.recommendation.noise_score}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-[var(--lab-muted)]">
                    blur score
                  </dt>
                  <dd className="font-mono text-base font-medium">
                    {result.recommendation.blur_score}
                  </dd>
                </div>
              </dl>

              <div className="mt-5 pt-5 border-t border-[var(--lab-hairline)]">
                {!explanation && (
                  <button
                    onClick={handleExplain}
                    disabled={explainLoading}
                    className="text-sm font-medium underline underline-offset-2 text-[var(--lab-ink)] hover:text-[var(--lab-muted)]"
                  >
                    {explainLoading ? "Thinking…" : "Explain this result →"}
                  </button>
                )}
                {explanation && (
                  <p className="text-sm leading-relaxed text-[var(--lab-muted)]">
                    {explanation}
                  </p>
                )}
              </div>
            </div>

            <div>
              <p className="text-sm text-[var(--lab-muted)] mb-4">Input</p>
              <div className="grid grid-cols-2 gap-6 max-w-md">
                <div
                  className={`bg-[var(--lab-surface)] p-3 border border-[var(--lab-hairline)] ${PRINT_SHADOW}`}
                >
                  <Image
                    src={`data:image/jpeg;base64,${result.images.original}`}
                    alt="Original"
                    width={300}
                    height={300}
                    unoptimized
                    className="w-full h-auto"
                  />
                  <p className="mt-2 font-mono text-xs text-[var(--lab-muted)]">
                    01 — source
                  </p>
                </div>
                <div
                  className={`bg-[var(--lab-surface)] p-3 border border-[var(--lab-hairline)] ${PRINT_SHADOW}`}
                >
                  <Image
                    src={`data:image/jpeg;base64,${result.images.corrupted}`}
                    alt="Corrupted"
                    width={300}
                    height={300}
                    unoptimized
                    className="w-full h-auto"
                  />
                  <p className="mt-2 font-mono text-xs text-[var(--lab-muted)]">
                    02 — degraded
                  </p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm text-[var(--lab-muted)] mb-4">Filtered</p>
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-8">
                {filterFrames.map((frame, index) => {
                  const isBest = frame.key === bestKey;
                  return (
                    <div key={frame.key} className="relative">
                      <div
                        className={`bg-[var(--lab-surface)] p-3 border ${PRINT_SHADOW} ${
                          isBest
                            ? "border-[var(--lab-good)]"
                            : "border-[var(--lab-hairline)]"
                        }`}
                      >
                        <Image
                          src={`data:image/jpeg;base64,${frame.image}`}
                          alt={FILTER_LABEL[frame.key]}
                          width={300}
                          height={300}
                          unoptimized
                          className="w-full h-auto"
                        />
                        <div className="mt-3 flex items-baseline justify-between">
                          <span className="text-sm font-medium">
                            {FILTER_LABEL[frame.key]}
                          </span>
                          <span className="font-mono text-[10px] text-[var(--lab-muted)]">
                            {String(index + 3).padStart(2, "0")}
                          </span>
                        </div>
                        <p
                          className={`font-mono text-2xl font-bold ${
                            isBest
                              ? "text-[var(--lab-good)]"
                              : "text-[var(--lab-ink)]"
                          }`}
                        >
                          {frame.psnr}
                          <span className="text-xs font-normal text-[var(--lab-muted)] ml-1">
                            dB
                          </span>
                        </p>
                        <p className="font-mono text-xs text-[var(--lab-muted)]">
                          SSIM {frame.ssim}
                        </p>
                      </div>
                      {isBest && (
                        <span className="absolute -top-3 -right-3 rotate-[8deg] border-2 border-[var(--lab-good)] text-[var(--lab-good)] bg-[var(--lab-surface)] px-2.5 py-1 text-[10px] font-semibold tracking-wide shadow-sm">
                          selected
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
