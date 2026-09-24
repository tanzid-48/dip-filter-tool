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
import { AnalysisResponse } from "@/types/analysis";

type FilterKey = "mean" | "median" | "gaussian" | "laplacian";

const FILTER_LABEL: Record<FilterKey, string> = {
  mean: "Mean",
  median: "Median",
  gaussian: "Gaussian",
  laplacian: "Laplacian",
};

const PRINT_SHADOW = "shadow-[0_6px_20px_-6px_rgba(33,28,22,0.22)]";

export default function BenchPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [noiseType, setNoiseType] = useState<string>("none");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setLoading(true);
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

  const filterFrames: { key: FilterKey; psnr: number; image: string }[] = result
    ? [
        { key: "mean", psnr: result.psnr.mean, image: result.images.mean },
        {
          key: "median",
          psnr: result.psnr.median,
          image: result.images.median,
        },
        {
          key: "gaussian",
          psnr: result.psnr.gaussian,
          image: result.images.gaussian,
        },
        {
          key: "laplacian",
          psnr: result.psnr.laplacian,
          image: result.images.laplacian,
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
    <main className="min-h-screen bg-[#F5F1EA] text-[#211C16] px-4 py-20 flex flex-col items-center gap-14 font-sans">
      {/* Masthead */}
      <div className="w-full max-w-md flex flex-col gap-2">
        <div className="flex items-baseline justify-between border-b-2 border-[#211C16] pb-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Filter bench
          </h1>
          <span className="font-mono text-xs text-[#7C7364]">CSE 4206 lab</span>
        </div>
        <p className="text-sm text-[#7C7364] leading-relaxed">
          Drop in a photo, add noise on purpose, and see which filter cleans it
          up best — read the PSNR to know for sure.
        </p>
      </div>

      {/* Control panel */}
      <div
        className={`w-full max-w-md bg-white border border-[#E4DED2] ${PRINT_SHADOW}`}
      >
        <div className="p-6 flex flex-col gap-5">
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[#C9BFA9] p-10 cursor-pointer transition-colors hover:border-[#211C16] focus-within:border-[#211C16]"
          >
            <span className="text-sm font-medium">
              {selectedFile
                ? selectedFile.name
                : "Drop a photo or click to choose"}
            </span>
            <span className="text-xs text-[#7C7364]">JPG or PNG</span>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="sr-only"
            />
          </label>

          {previewUrl && (
            <div className="relative w-full aspect-square border border-[#E4DED2] overflow-hidden bg-[#F5F1EA]">
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
            <label htmlFor="noise-select" className="text-sm text-[#7C7364]">
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
                className="w-full rounded-none border-[#E4DED2] h-11"
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
            className="w-full h-12 rounded-none bg-[#211C16] hover:bg-[#332C22] text-white text-base"
          >
            {loading ? "Running…" : "Run filters"}
          </Button>
        </div>
      </div>

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.4 }}
            className="w-full max-w-5xl flex flex-col gap-14"
          >
            {/* Verdict — stamped */}
            <div
              className={`relative border border-[#E4DED2] bg-white p-7 ${PRINT_SHADOW}`}
            >
              <span
                className={`absolute -top-4 left-7 rotate-[-4deg] border-2 bg-white px-3 py-1 text-xs font-semibold tracking-wide shadow-sm ${
                  isGoodQuality
                    ? "border-[#3F7D5C] text-[#3F7D5C]"
                    : "border-[#B5502E] text-[#B5502E]"
                }`}
              >
                {isGoodQuality ? "clean" : "needs cleanup"}
              </span>
              <p className="mt-2 text-lg font-medium">
                {result.recommendation.recommendation}
              </p>
              <dl className="mt-5 grid grid-cols-3 gap-6">
                <div>
                  <dt className="text-xs text-[#7C7364]">noise type</dt>
                  <dd className="font-mono text-base font-medium">
                    {result.recommendation.noise_type}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-[#7C7364]">noise score</dt>
                  <dd className="font-mono text-base font-medium">
                    {result.recommendation.noise_score}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-[#7C7364]">blur score</dt>
                  <dd className="font-mono text-base font-medium">
                    {result.recommendation.blur_score}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Reference prints */}
            <div>
              <p className="text-sm text-[#7C7364] mb-4">Input</p>
              <div className="grid grid-cols-2 gap-6 max-w-md">
                <div
                  className={`bg-white p-3 border border-[#E4DED2] ${PRINT_SHADOW}`}
                >
                  <Image
                    src={`data:image/jpeg;base64,${result.images.original}`}
                    alt="Original"
                    width={300}
                    height={300}
                    unoptimized
                    className="w-full h-auto"
                  />
                  <p className="mt-2 font-mono text-xs text-[#7C7364]">
                    01 — source
                  </p>
                </div>
                <div
                  className={`bg-white p-3 border border-[#E4DED2] ${PRINT_SHADOW}`}
                >
                  <Image
                    src={`data:image/jpeg;base64,${result.images.corrupted}`}
                    alt="Corrupted"
                    width={300}
                    height={300}
                    unoptimized
                    className="w-full h-auto"
                  />
                  <p className="mt-2 font-mono text-xs text-[#7C7364]">
                    02 — degraded
                  </p>
                </div>
              </div>
            </div>

            {/* Filter prints */}
            <div>
              <p className="text-sm text-[#7C7364] mb-4">Filtered</p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {filterFrames.map((frame, index) => {
                  const isBest = frame.key === bestKey;
                  return (
                    <div key={frame.key} className="relative">
                      <div
                        className={`bg-white p-3 border ${PRINT_SHADOW} ${
                          isBest ? "border-[#3F7D5C]" : "border-[#E4DED2]"
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
                          <span className="font-mono text-[10px] text-[#7C7364]">
                            {String(index + 3).padStart(2, "0")}
                          </span>
                        </div>
                        <p
                          className={`font-mono text-2xl font-bold ${
                            isBest ? "text-[#3F7D5C]" : "text-[#211C16]"
                          }`}
                        >
                          {frame.psnr}
                          <span className="text-xs font-normal text-[#7C7364] ml-1">
                            dB
                          </span>
                        </p>
                      </div>
                      {isBest && (
                        <span className="absolute -top-3 -right-3 rotate-[8deg] border-2 border-[#3F7D5C] text-[#3F7D5C] bg-white px-2.5 py-1 text-[10px] font-semibold tracking-wide shadow-sm">
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
