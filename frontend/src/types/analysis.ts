export interface PsnrResult {
  mean: number;
  median: number;
  gaussian: number;
  laplacian: number;
  bilateral: number;
}

export interface SsimResult {
  mean: number;
  median: number;
  gaussian: number;
  laplacian: number;
  bilateral: number;
}

export interface ImagesResult {
  original: string;
  corrupted: string;
  mean: string;
  median: string;
  gaussian: string;
  laplacian: string;
  bilateral: string;
}

export interface RecommendationResult {
  recommendation: string;
  noise_score: number;
  noise_type: string;
  blur_score: number;
}

export interface AnalysisResponse {
  images: ImagesResult;
  psnr: PsnrResult;
  ssim: SsimResult;
  recommendation: RecommendationResult;
}
