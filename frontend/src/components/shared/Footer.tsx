

export default function Footer() {
  return (
    <footer className="w-full border-t border-[var(--lab-hairline)] mt-auto">
      <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col items-center sm:items-start gap-1">
          <span className="text-sm font-medium text-[var(--lab-ink)]">
            Built by Tanzid
          </span>
          <span className="text-xs text-[var(--lab-muted)]">
            CSE 4206 · Digital Image Processing Sessional · Pundra
            University of Science &amp; Technology
          </span>
        </div>

        <div className="flex items-center gap-5 text-xs text-[var(--lab-muted)]">
          <a
            href="https://tanzid-portfolio-ah38.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--lab-ink)] transition-colors"
          >
            Portfolio
          </a>
          <a
            href="https://github.com/tanzid-48"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--lab-ink)] transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/tanzidmondol"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--lab-ink)] transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}