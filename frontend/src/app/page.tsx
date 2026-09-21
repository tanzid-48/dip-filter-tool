"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AnalysisResponse } from "@/types/analysis";
import {
  Sparkles,
  Upload,
  Wand2,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ListFilter,
  Waves,
  Zap,
} from "lucide-react";

const FILTER_META = {
  mean: {
    label: "Mean Filter",
    icon: Layers,
    color: "text-sky-600",
    bg: "bg-sky-50",
  },
  median: {
    label: "Median Filter",
    icon: ListFilter,
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  gaussian: {
    label: "Gaussian Filter",
    icon: Waves,
    color: "text-teal-600",
    bg: "bg-teal-50",
  },
  laplacian: {
    label: "Laplacian Filter",
    icon: Zap,
    color: "text-rose-600",
    bg: "bg-rose-50",
  },
};

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [noiseType, setNoiseType] = useState<string>("none");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResponse | null>(null);

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

  const filterCards = result
    ? [
        {
          key: "mean" as const,
          psnr: result.psnr.mean,
          image: result.images.mean,
        },
        {
          key: "median" as const,
          psnr: result.psnr.median,
          image: result.images.median,
        },
        {
          key: "gaussian" as const,
          psnr: result.psnr.gaussian,
          image: result.images.gaussian,
        },
        {
          key: "laplacian" as const,
          psnr: result.psnr.laplacian,
          image: result.images.laplacian,
        },
      ]
    : [];

  const bestKey = filterCards.length
    ? filterCards.reduce((best, current) =>
        current.psnr > best.psnr ? current : best,
      ).key
    : null;

  const isGoodQuality =
    result?.recommendation.recommendation.includes("No major issues");

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#eef2ff,_#f8fafc_60%)] px-4 py-16 flex flex-col items-center gap-12">
      {/* Hero */}
      <div className="flex flex-col items-center gap-3 text-center max-w-xl">
        <div className="flex items-center gap-2 bg-white shadow-sm border border-slate-200 rounded-full px-4 py-1.5 text-xs font-medium text-indigo-600">
          <Sparkles className="h-3.5 w-3.5" />
          DIP Sessional Project
        </div>
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-500 bg-clip-text text-transparent">
          Image Filter Lab
        </h1>
        <p className="text-slate-500">
          Upload an image, simulate noise, and let the recommendation engine
          pick the best filter — backed by real PSNR scores.
        </p>
      </div>

      {/* Upload Card */}
      <Card className="w-full max-w-md shadow-lg shadow-indigo-100/50 border-slate-200">
        <CardContent className="p-6 flex flex-col gap-4">
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-300 rounded-xl p-8 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-colors"
          >
            <Upload className="h-8 w-8 text-slate-400" />
            <p className="text-sm font-medium text-slate-700">
              {selectedFile ? selectedFile.name : "Click to upload an image"}
            </p>
            <p className="text-xs text-slate-400">JPG or PNG</p>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {previewUrl && (
            <div className="relative w-full aspect-square rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
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
            <p className="text-sm font-medium text-slate-700">
              Noise Simulation
            </p>
            <Select
              value={noiseType}
              onValueChange={(value) => {
                if (value) setNoiseType(value);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select noise type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Noise (Original)</SelectItem>
                <SelectItem value="gaussian">Gaussian Noise</SelectItem>
                <SelectItem value="salt_pepper">Salt & Pepper Noise</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleAnalyze}
            disabled={!selectedFile || loading}
            className="w-full gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4" />
                Analyze Image
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-5xl flex flex-col gap-10"
          >
            {/* Recommendation */}
            <Card
              className={`shadow-md border-l-4 ${
                isGoodQuality ? "border-l-emerald-500" : "border-l-amber-500"
              }`}
            >
              <CardContent className="p-6 flex items-start gap-3">
                {isGoodQuality ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                )}
                <div className="flex flex-col gap-2">
                  <p className="font-semibold text-slate-900">
                    {result.recommendation.recommendation}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">
                      Noise: {result.recommendation.noise_type}
                    </Badge>
                    <Badge variant="secondary">
                      Noise Score: {result.recommendation.noise_score}
                    </Badge>
                    <Badge variant="secondary">
                      Blur Score: {result.recommendation.blur_score}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Input images */}
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
                Input
              </p>
              <div className="grid grid-cols-2 gap-4 max-w-md">
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-medium text-center">Original</p>
                  <Image
                    src={`data:image/jpeg;base64,${result.images.original}`}
                    alt="Original"
                    width={300}
                    height={300}
                    unoptimized
                    className="w-full h-auto rounded-xl border border-slate-200 shadow-sm"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-medium text-center">Corrupted</p>
                  <Image
                    src={`data:image/jpeg;base64,${result.images.corrupted}`}
                    alt="Corrupted"
                    width={300}
                    height={300}
                    unoptimized
                    className="w-full h-auto rounded-xl border border-slate-200 shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* Filter comparison */}
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
                Filtered Results
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {filterCards.map((filter, index) => {
                  const meta = FILTER_META[filter.key];
                  const Icon = meta.icon;
                  const isBest = filter.key === bestKey;

                  return (
                    <motion.div
                      key={filter.key}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ y: -6 }}
                    >
                      <Card
                        className={`overflow-hidden shadow-md transition-shadow hover:shadow-xl ${
                          isBest
                            ? "ring-2 ring-indigo-500 ring-offset-2"
                            : "border-slate-200"
                        }`}
                      >
                        <div className="relative">
                          <Image
                            src={`data:image/jpeg;base64,${filter.image}`}
                            alt={meta.label}
                            width={300}
                            height={300}
                            unoptimized
                            className="w-full h-auto"
                          />
                          {isBest && (
                            <Badge className="absolute top-3 right-3 bg-indigo-600 shadow-md">
                              Best
                            </Badge>
                          )}
                        </div>
                        <CardContent className="p-4 flex flex-col gap-3">
                          <div className="flex items-center gap-2">
                            <span
                              className={`flex h-8 w-8 items-center justify-center rounded-lg ${meta.bg}`}
                            >
                              <Icon className={`h-4 w-4 ${meta.color}`} />
                            </span>
                            <p className="font-medium text-slate-900">
                              {meta.label}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{
                                  width: `${Math.min(
                                    (filter.psnr / 45) * 100,
                                    100,
                                  )}%`,
                                }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className={`h-full rounded-full ${
                                  isBest ? "bg-indigo-500" : "bg-slate-400"
                                }`}
                              />
                            </div>
                            <span className="text-xs text-slate-500 shrink-0 font-mono">
                              {filter.psnr} dB
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
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
