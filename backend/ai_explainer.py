import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.0-flash")


def explain_result(recommendation, psnr, ssim):
    prompt = f"""You are explaining an image-filtering lab result to a student.

Recommendation engine output:
- Noise type detected: {recommendation['noise_type']}
- Noise score: {recommendation['noise_score']}
- Blur score: {recommendation['blur_score']}
- Recommended action: {recommendation['recommendation']}

PSNR scores (dB, higher is better): {psnr}
SSIM scores (0-1, higher is better): {ssim}

In 3-4 short sentences, explain in plain English why the recommended
filter makes sense given these numbers. Be specific about the scores.
Do not repeat the raw numbers back verbatim in a list — write it as
flowing explanation."""

    response = model.generate_content(prompt)
    return response.text
