# 🔬 DIP Filter Lab

**Image Quality Assessment & Filter Recommendation Tool**

Built for **CSE 4206 — Digital Image Processing Sessional**\
Pundra University of Science & Technology

![Live App](https://img.shields.io/badge/Live%20App-Vercel-black?style=for-the-badge&logo=vercel) ![Backend API](https://img.shields.io/badge/Backend%20API-Render-46E3B7?style=for-the-badge&logo=render)

![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white) ![Flask](https://img.shields.io/badge/Flask-000000?style=flat-square&logo=flask&logoColor=white) ![OpenCV](https://img.shields.io/badge/OpenCV-5C3EE8?style=flat-square&logo=opencv&logoColor=white) ![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=next.js&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white) ![Tailwind](https://img.shields.io/badge/Tailwind-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white) ![Gemini](https://img.shields.io/badge/Gemini-8E75B2?style=flat-square&logo=googlegemini&logoColor=white)

---

⚠️ **Note:** The backend runs on Render's free tier and sleeps after 15 minutes of inactivity. The first request after a period of inactivity may take **30–50 seconds** while it wakes up.

---

## 📖 Overview

Upload a photo, optionally corrupt it with **Gaussian** or **Salt & Pepper** noise, and the bench runs it through **seven filters** — five spatial-domain and two frequency-domain.

Each result is scored with two independent quality metrics (**PSNR** and **SSIM**), the best-performing filter is highlighted, and a rule-based recommendation engine explains _why_ that filter fits the detected noise — with an optional **AI-generated plain-English explanation** powered by Gemini.

The site also doubles as a study reference:

- 📚 **Filter Library** — theory, formula, kernel, and exam-style Q&A for every filter
- ⚙️ **Engine page** — walkthrough of the actual noise/blur-detection code behind the recommendation

---

## 🧪 Filters Implemented

| Filter        | Domain                 | Best For                               |
| ------------- | ---------------------- | -------------------------------------- |
| **Mean**      | Spatial — Smoothing    | Gaussian noise                         |
| **Median**    | Spatial — Smoothing    | Salt & Pepper noise                    |
| **Gaussian**  | Spatial — Smoothing    | Gaussian noise, natural blur           |
| **Bilateral** | Spatial — Smoothing    | Noise reduction while preserving edges |
| **Laplacian** | Spatial — Sharpening   | Edge detection / sharpening            |
| **Low-pass**  | Frequency Domain (FFT) | General smoothing                      |
| **High-pass** | Frequency Domain (FFT) | Edge / detail enhancement              |

---

## 🧠 How the Recommendation Engine Works

| Step             | Method                                | What It Tells the Engine            |
| ---------------- | ------------------------------------- | ----------------------------------- |
| Blur detection   | Laplacian variance                    | Low variance → likely blurry        |
| Noise estimation | Std. dev. vs. median-filtered version | Higher → more noise present         |
| Noise-type check | % of pixels at 0 or 255               | > 1% → Salt & Pepper, else Gaussian |

> Full code and rationale on the **[/engine](https://dip-filter-tool.vercel.app/engine)** page, or see `backend/filters.py`.

---

## 📊 Quality Metrics

| Metric   | Measures                                               | Range    | Better When |
| -------- | ------------------------------------------------------ | -------- | ----------- |
| **PSNR** | Pixel-level difference from original                   | 0 → ∞ dB | Higher      |
| **SSIM** | Perceptual similarity (luminance, contrast, structure) | 0 → 1    | Higher      |

> Full formulas and rationale on the **[/about](https://dip-filter-tool.vercel.app/about)** page.

---

## 🛠️ Tech Stack

### Backend

- **Python** + **Flask**
- **OpenCV** + **NumPy**
- **scikit-image** (SSIM)
- **Google Gemini** (`google-genai`)
- Deployed on **Render**

### Frontend

- **Next.js** (TypeScript, App Router)
- **Tailwind CSS** + **shadcn/ui**
- **Framer Motion**
- **next-themes** (dark/light mode)
- Deployed on **Vercel**

---

## 📁 Project Structure

```
dip-filter-tool/
├── backend/
│   ├── app.py           # Flask routes (/analyze, /explain)
│   ├── filters.py       # All filter, metric, and noise functions
│   ├── ai_explainer.py  # Gemini-powered result explanation
│   └── requirements.txt
│
└── frontend/
    ├── src/app/
    │   ├── page.tsx          # Home
    │   ├── bench/page.tsx    # The tool
    │   ├── filters/          # Filter library (index + per-filter pages)
    │   ├── engine/page.tsx   # How the recommendation engine works
    │   └── about/page.tsx    # PSNR/SSIM explanation
    ├── src/components/       # Navbar, Footer, shadcn UI components
    └── src/data/filters.ts   # Educational content for the library
```

---

## 🚀 Running Locally

### Backend

```
cd backend
pip install -r requirements.txt
# Create a .env file:  GEMINI_API_KEY=your_key_here
python app.py
```

Runs on `http://127.0.0.1:5000`

### Frontend

```
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:3000`

> Without a `NEXT_PUBLIC_API_URL` environment variable, it talks to the local backend above by default.

---

## 👤 Author

**Tanzid**\
B.Sc. CSE · Pundra University of Science & Technology

![Portfolio](https://img.shields.io/badge/Portfolio-000000?style=flat-square&logo=vercel&logoColor=white) ![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white) ![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=flat-square&logo=linkedin&logoColor=white)
