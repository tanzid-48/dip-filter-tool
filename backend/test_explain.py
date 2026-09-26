from ai_explainer import explain_result

recommendation = {
    "recommendation": "Median Filter",
    "noise_type": "Salt & Pepper",
    "noise_score": 32.92,
    "blur_score": 497.45,
}
psnr = {
    "mean": 26.8,
    "median": 30.8,
    "gaussian": 26.6,
    "laplacian": 11.1,
    "bilateral": 17.6,
}
ssim = {
    "mean": 0.68,
    "median": 0.87,
    "gaussian": 0.63,
    "laplacian": 0.22,
    "bilateral": 0.26,
}

result = explain_result(recommendation, psnr, ssim)
print(result)
