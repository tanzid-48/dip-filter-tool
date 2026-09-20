"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AnalysisResponse } from "@/types/analysis";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
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

  return (
    <main className="min-h-screen p-8 flex flex-col items-center gap-6">
      <h1 className="text-3xl font-bold">Image Filter Comparison Tool</h1>

      <Card className="w-full max-w-md">
        <CardContent className="p-6 flex flex-col gap-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border rounded p-2"
          />

          {previewUrl && (
            <div className="relative w-full aspect-square rounded-lg border overflow-hidden">
              <Image
                src={previewUrl}
                alt="Preview"
                fill
                className="object-contain"
              />
            </div>
          )}

          <Button onClick={handleAnalyze} disabled={!selectedFile || loading}>
            {loading ? "Analyzing..." : "Analyze Image"}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <div className="w-full max-w-4xl flex flex-col gap-6">
          <Card className="p-6">
            <h2 className="font-semibold mb-2">Recommendation</h2>
            <p>{result.recommendation.recommendation}</p>
            <p className="text-sm text-gray-500">
              Noise Type: {result.recommendation.noise_type} | Noise Score:{" "}
              {result.recommendation.noise_score} | Blur Score:{" "}
              {result.recommendation.blur_score}
            </p>
          </Card>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-center font-medium mb-1">Original</p>
              <Image
                src={`data:image/jpeg;base64,${result.images.original}`}
                alt="Original"
                width={300}
                height={300}
                unoptimized
                className="w-full h-auto rounded-lg border"
              />
            </div>
            <div>
              <p className="text-center font-medium mb-1">
                Mean (PSNR: {result.psnr.mean})
              </p>
              <Image
                src={`data:image/jpeg;base64,${result.images.mean}`}
                alt="Mean Filter"
                width={300}
                height={300}
                unoptimized
                className="w-full h-auto rounded-lg border"
              />
            </div>
            <div>
              <p className="text-center font-medium mb-1">
                Median (PSNR: {result.psnr.median})
              </p>
              <Image
                src={`data:image/jpeg;base64,${result.images.median}`}
                alt="Median Filter"
                width={300}
                height={300}
                unoptimized
                className="w-full h-auto rounded-lg border"
              />
            </div>
            <div>
              <p className="text-center font-medium mb-1">
                Gaussian (PSNR: {result.psnr.gaussian})
              </p>
              <Image
                src={`data:image/jpeg;base64,${result.images.gaussian}`}
                alt="Gaussian Filter"
                width={300}
                height={300}
                unoptimized
                className="w-full h-auto rounded-lg border"
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
