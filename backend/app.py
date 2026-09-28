from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
from filters import (
    apply_mean_filter,
    apply_median_filter,
    apply_gaussian_filter,
    apply_laplacian_filter,
    apply_bilateral_filter,
    apply_lowpass_filter,
    apply_highpass_filter,
    calculate_psnr,
    calculate_ssim,
    recommend_filter,
    image_to_base64,
    add_gaussian_noise,
    add_salt_pepper_noise,
)
from ai_explainer import explain_result

app = Flask(__name__)
CORS(app)

MAX_DIM = 800


@app.route("/")
def home():
    return "Flask server is running!"


@app.route("/analyze", methods=["POST"])
def analyze_image():
    file = request.files["image"]
    noise_option = request.form.get("noise_type", "none")

    file_bytes = np.frombuffer(file.read(), np.uint8)
    img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

    if img is None:
        return jsonify({"error": "Could not read the uploaded image"}), 400

    # Downscale large uploads to keep memory use and response size manageable
    h, w = img.shape[:2]
    if max(h, w) > MAX_DIM:
        scale = MAX_DIM / max(h, w)
        img = cv2.resize(
            img,
            (int(w * scale), int(h * scale)),
            interpolation=cv2.INTER_AREA,
        )

    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    if noise_option == "gaussian":
        working_image = add_gaussian_noise(img_rgb)
    elif noise_option == "salt_pepper":
        working_image = add_salt_pepper_noise(img_rgb)
    else:
        working_image = img_rgb

    mean_result = apply_mean_filter(working_image)
    median_result = apply_median_filter(working_image)
    gaussian_result = apply_gaussian_filter(working_image)
    laplacian_result = apply_laplacian_filter(working_image)
    bilateral_result = apply_bilateral_filter(working_image)
    lowpass_result = apply_lowpass_filter(working_image)
    highpass_result = apply_highpass_filter(working_image)

    recommendation = recommend_filter(working_image)

    response = {
        "images": {
            "original": image_to_base64(img_rgb),
            "corrupted": image_to_base64(working_image),
            "mean": image_to_base64(mean_result),
            "median": image_to_base64(median_result),
            "gaussian": image_to_base64(gaussian_result),
            "laplacian": image_to_base64(laplacian_result),
            "bilateral": image_to_base64(bilateral_result),
            "lowpass": image_to_base64(lowpass_result),
            "highpass": image_to_base64(highpass_result),
        },
        "psnr": {
            "mean": round(calculate_psnr(img_rgb, mean_result), 2),
            "median": round(calculate_psnr(img_rgb, median_result), 2),
            "gaussian": round(calculate_psnr(img_rgb, gaussian_result), 2),
            "laplacian": round(calculate_psnr(img_rgb, laplacian_result), 2),
            "bilateral": round(calculate_psnr(img_rgb, bilateral_result), 2),
            "lowpass": round(calculate_psnr(img_rgb, lowpass_result), 2),
            "highpass": round(calculate_psnr(img_rgb, highpass_result), 2),
        },
        "ssim": {
            "mean": round(calculate_ssim(img_rgb, mean_result), 3),
            "median": round(calculate_ssim(img_rgb, median_result), 3),
            "gaussian": round(calculate_ssim(img_rgb, gaussian_result), 3),
            "laplacian": round(calculate_ssim(img_rgb, laplacian_result), 3),
            "bilateral": round(calculate_ssim(img_rgb, bilateral_result), 3),
            "lowpass": round(calculate_ssim(img_rgb, lowpass_result), 3),
            "highpass": round(calculate_ssim(img_rgb, highpass_result), 3),
        },
        "recommendation": recommendation,
    }

    return jsonify(response)


@app.route("/explain", methods=["POST"])
def explain():
    data = request.get_json()
    recommendation = data["recommendation"]
    psnr = data["psnr"]
    ssim = data["ssim"]

    try:
        explanation = explain_result(recommendation, psnr, ssim)
        return jsonify({"explanation": explanation})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000, use_reloader=False)
