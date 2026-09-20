export interface PsnrResult {
  mean: number;
  median: number;
  gaussian: number;
}

export interface RecommendationResult {
  recommendation: string;
  noise_score: number;
  noise_type: string;
  blur_score: number;
}

export interface AnalysisResponse {
  psnr: PsnrResult;
  recommendation: RecommendationResult;
}
