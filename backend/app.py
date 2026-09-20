from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
from filters import (
    apply_mean_filter,
    apply_median_filter,
    apply_gaussian_filter,
    calculate_psnr,
    recommend_filter,
)

app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return "Flask server is running!"


@app.route("/analyze", methods=["POST"])
def analyze_image():
    file = request.files["image"]
    file_bytes = np.frombuffer(file.read(), np.uint8)
    img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    mean_result = apply_mean_filter(img_rgb)
    median_result = apply_median_filter(img_rgb)
    gaussian_result = apply_gaussian_filter(img_rgb)

    recommendation = recommend_filter(img_rgb)

    response = {
        "psnr": {
            "mean": round(calculate_psnr(img_rgb, mean_result), 2),
            "median": round(calculate_psnr(img_rgb, median_result), 2),
            "gaussian": round(calculate_psnr(img_rgb, gaussian_result), 2),
        },
        "recommendation": recommendation,
    }

    return jsonify(response)


if __name__ == "__main__":
    app.run(debug=True, port=5000, use_reloader=False)
