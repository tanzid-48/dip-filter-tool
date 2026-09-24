import Link from "next/link";
import { filters } from "@/data/filters";

export default function FiltersLibraryPage() {
  return (
    <main className="min-h-screen bg-[var(--lab-bg)] text-[var(--lab-ink)] px-4 py-20 flex flex-col items-center gap-10">
      <div className="w-full max-w-3xl flex flex-col gap-2">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-xs text-[var(--lab-muted)] hover:text-[var(--lab-ink)]"
          >
            ← home
          </Link>
          <Link
            href="/bench"
            className="text-xs text-[var(--lab-muted)] hover:text-[var(--lab-ink)]"
          >
            open bench →
          </Link>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight border-b-2 border-[var(--lab-ink)] pb-2">
          Filter library
        </h1>
        <p className="text-sm text-[var(--lab-muted)]">
          Every filter in the tool, explained — theory, formula, and exam-style
          answers.
        </p>
      </div>

      <div className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 gap-6">
        {filters.map((filter) => (
          <Link
            key={filter.slug}
            href={`/filters/${filter.slug}`}
            className="bg-[var(--lab-surface)] border border-[var(--lab-hairline)] p-5 flex flex-col gap-2 hover:border-[var(--lab-ink)] transition-colors shadow-[0_6px_20px_-6px_rgba(0,0,0,0.15)]"
          >
            <span className="font-mono text-xs text-[var(--lab-muted)]">
              {filter.category}
            </span>
            <span className="text-lg font-medium">{filter.name}</span>
            <span className="text-sm text-[var(--lab-muted)]">
              {filter.tagline}
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
