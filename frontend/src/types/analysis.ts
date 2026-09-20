export interface PsnrResult {
  mean: number;
  median: number;
  gaussian: number;
}

export interface ImagesResult {
  original: string;
  mean: string;
  median: string;
  gaussian: string;
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
  recommendation: RecommendationResult;
}
