import os
import time
from google import genai
from google.genai import errors
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

MODELS_TO_TRY = ["gemini-flash-latest", "gemini-3.8-flash", "gemini-3.1-flash-lite"]


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

    last_error = None
    for model_name in MODELS_TO_TRY:
        for attempt in range(2):
            try:
                response = client.models.generate_content(
                    model=model_name, contents=prompt
                )
                return response.text
            except errors.ServerError as e:
                last_error = e
                time.sleep(2)
                continue
    raise last_error
