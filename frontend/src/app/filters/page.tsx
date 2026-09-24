import Link from "next/link";
import { filters } from "@/data/filters";

export default function FiltersLibraryPage() {
  return (
    <main className="min-h-screen bg-[#F5F1EA] text-[#211C16] px-4 py-20 flex flex-col items-center gap-10">
      <div className="w-full max-w-3xl flex flex-col gap-2">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-xs text-[#7C7364] hover:text-[#211C16]"
          >
            ← home
          </Link>
          <Link
            href="/bench"
            className="text-xs text-[#7C7364] hover:text-[#211C16]"
          >
            open bench →
          </Link>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight border-b-2 border-[#211C16] pb-2">
          Filter library
        </h1>
        <p className="text-sm text-[#7C7364]">
          Every filter in the tool, explained — theory, formula, and exam-style
          answers.
        </p>
      </div>

      <div className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 gap-6">
        {filters.map((filter) => (
          <Link
            key={filter.slug}
            href={`/filters/${filter.slug}`}
            className="bg-white border border-[#E4DED2] p-5 flex flex-col gap-2 hover:border-[#211C16] transition-colors shadow-[0_6px_20px_-6px_rgba(33,28,22,0.15)]"
          >
            <span className="font-mono text-xs text-[#7C7364]">
              {filter.category}
            </span>
            <span className="text-lg font-medium">{filter.name}</span>
            <span className="text-sm text-[#7C7364]">{filter.tagline}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
