import cv2
import numpy as np
import base64


def apply_mean_filter(image):
    return cv2.blur(image, (5, 5))


def apply_median_filter(image):
    return cv2.medianBlur(image, 5)


def apply_gaussian_filter(image):
    return cv2.GaussianBlur(image, (5, 5), 1)


def calculate_psnr(original, processed):
    mse = np.mean((original.astype(np.float64) - processed.astype(np.float64)) ** 2)
    if mse == 0:
        return float("inf")
    return 20 * np.log10(255.0 / np.sqrt(mse))


def detect_blur(image):
    gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
    gray_smoothed = cv2.GaussianBlur(gray, (3, 3), 0)
    return cv2.Laplacian(gray_smoothed, cv2.CV_64F).var()


def estimate_noise(image):
    gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
    denoised = cv2.medianBlur(gray, 3)
    noise = gray.astype(np.float64) - denoised.astype(np.float64)
    return np.std(noise)


def detect_noise_type(image):
    gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
    extreme_pixel_count = np.sum((gray == 0) | (gray == 255))
    extreme_ratio = extreme_pixel_count / gray.size
    return "Salt & Pepper" if extreme_ratio > 0.01 else "Gaussian"


def recommend_filter(image):
    noise_level = estimate_noise(image)
    blur_level = detect_blur(image)
    noise_type = detect_noise_type(image)

    NOISE_THRESHOLD = 8
    BLUR_THRESHOLD = 30

    if noise_level > NOISE_THRESHOLD:
        recommendation = (
            "Median Filter" if noise_type == "Salt & Pepper" else "Gaussian Filter"
        )
    elif blur_level < BLUR_THRESHOLD:
        recommendation = "Laplacian/Unsharp Masking"
    else:
        recommendation = "No major issues detected"

    return {
        "recommendation": recommendation,
        "noise_score": round(noise_level, 2),
        "noise_type": noise_type,
        "blur_score": round(blur_level, 2),
    }


def image_to_base64(image):
    _, buffer = cv2.imencode(".jpg", cv2.cvtColor(image, cv2.COLOR_RGB2BGR))
    return base64.b64encode(buffer).decode("utf-8")


def add_gaussian_noise(image, mean=0, sigma=25):
    gauss = np.random.normal(mean, sigma, image.shape).astype(np.float32)
    noisy = image.astype(np.float32) + gauss
    noisy = np.clip(noisy, 0, 255).astype(np.uint8)
    return noisy


def add_salt_pepper_noise(image, amount=0.02):
    noisy = image.copy()
    num_salt = int(amount * image.size * 0.5)
    num_pepper = int(amount * image.size * 0.5)

    coords = [np.random.randint(0, i, num_salt) for i in image.shape[:2]]
    noisy[coords[0], coords[1]] = 255

    coords = [np.random.randint(0, i, num_pepper) for i in image.shape[:2]]
    noisy[coords[0], coords[1]] = 0

    return noisy
