import Link from "next/link";

export default function AboutPage() {
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
            CSE 4206 · Digital Image Processing Sessional
          </span>
          <h1 className="text-2xl font-semibold tracking-tight">
            About this bench
          </h1>
        </div>
      </div>

      <div className="w-full max-w-2xl flex flex-col gap-10">
        {/* Project summary */}
        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-medium text-[var(--lab-muted)]">
            What this is
          </h2>
          <p className="text-sm leading-relaxed">
            An Image Quality Assessment & Filter Recommendation Tool built for
            the DIP lab. Upload a photo, optionally corrupt it with Gaussian or
            Salt &amp; Pepper noise, and the bench runs five filters against it
            — Mean, Median, Gaussian, Laplacian, and Bilateral — then scores
            each result with two independent quality metrics and recommends the
            best fit.
          </p>
        </section>

        {/* PSNR */}
        <section className="flex flex-col gap-3">
          <h2 className="font-medium">PSNR — Peak Signal-to-Noise Ratio</h2>
          <p className="text-sm leading-relaxed">
            PSNR compares a filtered image to the original pixel-by-pixel. It
            first computes MSE (Mean Squared Error), then converts it to a
            decibel scale. Higher PSNR means the filtered image is closer to the
            original — less distortion.
          </p>
          <p className="font-mono text-sm bg-[var(--lab-surface)] border border-[var(--lab-hairline)] p-3">
            MSE = (1/mn) × ΣΣ [I(i,j) − K(i,j)]²
          </p>
          <p className="font-mono text-sm bg-[var(--lab-surface)] border border-[var(--lab-hairline)] p-3">
            PSNR = 20 × log₁₀(MAX / √MSE)
          </p>
          <p className="text-xs text-[var(--lab-muted)]">
            MAX is 255 for an 8-bit image. Typical &quot;good&quot; PSNR for
            lightly-degraded photos falls in the 30–40 dB range.
          </p>
        </section>

        {/* SSIM */}
        <section className="flex flex-col gap-3">
          <h2 className="font-medium">SSIM — Structural Similarity Index</h2>
          <p className="text-sm leading-relaxed">
            PSNR only measures raw pixel differences — it does not necessarily
            match what a human eye considers &quot;similar.&quot; SSIM instead
            compares luminance, contrast, and structure between two images,
            producing a score from 0 to 1. A score of 1 means the images are
            structurally identical.
          </p>
          <p className="font-mono text-sm bg-[var(--lab-surface)] border border-[var(--lab-hairline)] p-3">
            SSIM(x,y) = [(2μₓμᵧ+c₁)(2σₓᵧ+c₂)] / [(μₓ²+μᵧ²+c₁)(σₓ²+σᵧ²+c₂)]
          </p>
          <p className="text-xs text-[var(--lab-muted)]">
            μ = mean, σ = variance/covariance, c₁/c₂ = small constants that
            stabilize the division.
          </p>
        </section>

        {/* Why both */}
        <section className="bg-[var(--lab-surface)] border border-[var(--lab-hairline)] p-5 flex flex-col gap-2">
          <span className="text-xs text-[var(--lab-muted)]">
            why use both metrics
          </span>
          <p className="text-sm leading-relaxed">
            PSNR and SSIM measure different things — one is purely numerical,
            the other is perceptual. When they agree on the same winning filter,
            as they do in most of the bench&apos;s test runs, that agreement is
            stronger evidence than either score alone.
          </p>
        </section>

        {/* Stack */}
        <section className="flex flex-col gap-3">
          <h2 className="font-medium">How it&apos;s built</h2>
          <ul className="flex flex-col gap-1.5 text-sm">
            <li>
              <span className="text-[var(--lab-muted)]">Backend —</span> Python,
              Flask, OpenCV, NumPy, scikit-image
            </li>
            <li>
              <span className="text-[var(--lab-muted)]">Frontend —</span>{" "}
              Next.js, TypeScript, Tailwind CSS, Framer Motion
            </li>
            <li>
              <span className="text-[var(--lab-muted)]">AI explanation —</span>{" "}
              Google Gemini, given the actual PSNR/SSIM scores as context
            </li>
          </ul>
        </section>

        {/* Links */}
        <section className="flex gap-4">
          <Link
            href="/bench"
            className="text-sm font-medium underline underline-offset-2"
          >
            Open the bench →
          </Link>
          <Link
            href="/engine"
            className="text-sm font-medium underline underline-offset-2"
          >
            How recommendations work →
          </Link>
        </section>
      </div>
    </main>
  );
}
