from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
from filters import (
    apply_mean_filter,
    apply_median_filter,
    apply_gaussian_filter,
    apply_laplacian_filter,
    calculate_psnr,
    recommend_filter,
    image_to_base64,
    add_gaussian_noise,
    add_salt_pepper_noise,
)

app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return "Flask server is running!"


@app.route("/analyze", methods=["POST"])
def analyze_image():
    file = request.files["image"]
    noise_option = request.form.get("noise_type", "none")

    file_bytes = np.frombuffer(file.read(), np.uint8)
    img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
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

    recommendation = recommend_filter(working_image)

    response = {
        "images": {
            "original": image_to_base64(img_rgb),
            "corrupted": image_to_base64(working_image),
            "mean": image_to_base64(mean_result),
            "median": image_to_base64(median_result),
            "gaussian": image_to_base64(gaussian_result),
            "laplacian": image_to_base64(laplacian_result),
        },
        "psnr": {
            "mean": round(calculate_psnr(img_rgb, mean_result), 2),
            "median": round(calculate_psnr(img_rgb, median_result), 2),
            "gaussian": round(calculate_psnr(img_rgb, gaussian_result), 2),
            "laplacian": round(calculate_psnr(img_rgb, laplacian_result), 2),
        },
        "recommendation": recommendation,
    }

    return jsonify(response)


if __name__ == "__main__":
    app.run(debug=True, port=5000, use_reloader=False)
