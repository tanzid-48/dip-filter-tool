import Link from "next/link";

export default function EnginePage() {
  return (
    <main className="min-h-screen bg-[var(--lab-bg)] text-[var(--lab-ink)] px-4 py-20 flex flex-col items-center gap-10">
      <div className="w-full max-w-2xl flex flex-col gap-3">
        <Link
          href="/"
          className="text-xs text-[var(--lab-muted)] hover:text-[var(--lab-ink)]"
        >
          ← home
        </Link>
        <div className="border-b-2 border-[var(--lab-ink)] pb-3">
          <span className="font-mono text-xs text-[var(--lab-muted)]">
            How the bench decides
          </span>
          <h1 className="text-2xl font-semibold tracking-tight">
            Recommendation engine
          </h1>
        </div>
        <p className="text-sm text-[var(--lab-muted)] leading-relaxed">
          Before any filter runs, the bench measures the photo itself — how
          noisy it is, what kind of noise, and how blurry it is — then picks a
          filter based on those readings.
        </p>
      </div>

      <div className="w-full max-w-2xl flex flex-col gap-10">
        {/* Step 1: Blur detection */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-[var(--lab-muted)] border border-[var(--lab-hairline)] px-2 py-0.5">
              01
            </span>
            <h2 className="font-medium">Measuring blur</h2>
          </div>
          <p className="text-sm leading-relaxed">
            The image is converted to grayscale and lightly smoothed, then
            passed through a Laplacian filter. A sharp photo has lots of edges,
            so the Laplacian output varies a lot from pixel to pixel — high
            variance. A blurry photo has few edges, so the variance stays low.
          </p>
          <pre className="bg-[#17140F] text-[#F5F1EA] p-4 overflow-x-auto text-sm font-mono">
            {`def detect_blur(image):
    gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
    smoothed = cv2.GaussianBlur(gray, (3, 3), 0)
    return cv2.Laplacian(smoothed, cv2.CV_64F).var()`}
          </pre>
          <p className="text-xs text-[var(--lab-muted)]">
            Low variance → likely blurry → sharpening is recommended.
          </p>
        </section>

        {/* Step 2: Noise level */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-[var(--lab-muted)] border border-[var(--lab-hairline)] px-2 py-0.5">
              02
            </span>
            <h2 className="font-medium">Measuring noise</h2>
          </div>
          <p className="text-sm leading-relaxed">
            A quick median-filtered version of the image stands in for a
            &quot;clean&quot; reference. Subtracting it from the original leaves
            mostly noise behind. The spread (standard deviation) of that
            difference becomes the noise score.
          </p>
          <pre className="bg-[#17140F] text-[#F5F1EA] p-4 overflow-x-auto text-sm font-mono">
            {`def estimate_noise(image):
    gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
    denoised = cv2.medianBlur(gray, 3)
    diff = gray.astype(np.float64) - denoised.astype(np.float64)
    return np.std(diff)`}
          </pre>
          <p className="text-xs text-[var(--lab-muted)]">
            Higher score → more noise present.
          </p>
        </section>

        {/* Step 3: Noise type */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-[var(--lab-muted)] border border-[var(--lab-hairline)] px-2 py-0.5">
              03
            </span>
            <h2 className="font-medium">Telling noise types apart</h2>
          </div>
          <p className="text-sm leading-relaxed">
            Salt & Pepper noise pushes pixels all the way to pure black (0) or
            pure white (255). Gaussian noise rarely does — it nudges values
            slightly. So the engine simply counts what fraction of pixels sit at
            those two extremes.
          </p>
          <pre className="bg-[#17140F] text-[#F5F1EA] p-4 overflow-x-auto text-sm font-mono">
            {`def detect_noise_type(image):
    gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
    extreme = np.sum((gray == 0) | (gray == 255))
    ratio = extreme / gray.size
    return "Salt & Pepper" if ratio > 0.01 else "Gaussian"`}
          </pre>
          <p className="text-xs text-[var(--lab-muted)]">
            More than 1% pure black/white pixels → Salt & Pepper.
          </p>
        </section>

        {/* Step 4: Decision */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-[var(--lab-muted)] border border-[var(--lab-hairline)] px-2 py-0.5">
              04
            </span>
            <h2 className="font-medium">Choosing a filter</h2>
          </div>
          <p className="text-sm leading-relaxed">
            With those three readings in hand, the engine follows a simple rule
            order: noise first, then blur, then default to &quot;looks
            fine&quot;.
          </p>
          <pre className="bg-[#17140F] text-[#F5F1EA] p-4 overflow-x-auto text-sm font-mono">
            {`if noise_score > 8:
    return "Median" if noise_type == "Salt & Pepper" else "Gaussian"
elif blur_score < 30:
    return "Laplacian / Unsharp Masking"
else:
    return "No major issues detected"`}
          </pre>
        </section>

        {/* Why rule-based */}
        <section className="bg-[var(--lab-surface)] border border-[var(--lab-hairline)] p-5 flex flex-col gap-2">
          <span className="text-xs text-[var(--lab-muted)]">
            why rule-based, not a trained model
          </span>
          <p className="text-sm leading-relaxed">
            The engine uses fixed, tuned thresholds rather than a machine
            learning classifier. That keeps every decision traceable — you can
            point at the exact number that triggered a recommendation, which is
            what makes it verifiable against the PSNR scores rather than a black
            box.
          </p>
        </section>

        {/* Exam Q&A */}
        <section className="flex flex-col gap-6">
          <h2 className="text-sm font-medium text-[var(--lab-muted)]">
            Exam question
          </h2>
          <div className="bg-[var(--lab-surface)] border border-[var(--lab-hairline)] p-5 flex flex-col gap-3">
            <p className="font-medium">
              How does the recommendation engine decide which filter to apply to
              a given image?
            </p>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-[var(--lab-muted)]">ব্যাখ্যা</span>
              <p className="text-sm leading-relaxed">
                প্রথমে ছবির noise level measure করা হয় (median-filtered
                version-এর সাথে original-এর পার্থক্যের standard deviation
                দিয়ে), এবং noise-এর ধরন (pure black/white pixel কত percentage)
                চেক করা হয়। যদি noise threshold-এর বেশি হয়, noise type
                অনুযায়ী Median বা Gaussian filter suggest করা হয়। যদি noise কম
                কিন্তু Laplacian variance (blur measure) কম থাকে, sharpening
                suggest করা হয়। নাহলে ছবি ঠিক আছে বলে ধরে নেওয়া হয়।
              </p>
            </div>
            <div className="flex flex-col gap-1 border-t border-[var(--lab-hairline)] pt-3">
              <span className="text-xs text-[var(--lab-muted)]">
                exam answer
              </span>
              <p className="text-sm leading-relaxed">
                The engine first computes a noise score (standard deviation
                between the image and its median-filtered version) and
                classifies the noise type by the fraction of pixels at pure
                black or white. If the noise score exceeds a threshold, it
                recommends Median filtering for impulse noise or Gaussian
                filtering otherwise. If noise is low but the Laplacian-variance
                blur score is below its threshold, it recommends sharpening.
                Otherwise it reports no major issues.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
