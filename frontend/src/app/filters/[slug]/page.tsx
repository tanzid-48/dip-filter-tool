import Link from "next/link";
import { notFound } from "next/navigation";
import { filters, getFilterBySlug } from "@/data/filters";

export function generateStaticParams() {
  return filters.map((f) => ({ slug: f.slug }));
}

export default async function FilterDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const filter = getFilterBySlug(slug);

  if (!filter) notFound();

  return (
    <main className="min-h-screen bg-[var(--lab-bg)] text-[var(--lab-ink)] px-4 py-20 flex flex-col items-center gap-10">
      <div className="w-full max-w-2xl flex flex-col gap-3">
        <Link
          href="/filters"
          className="text-xs text-[var(--lab-muted)] hover:text-[var(--lab-ink)]"
        >
          ← filter library
        </Link>
        <div className="border-b-2 border-[var(--lab-ink)] pb-3">
          <span className="font-mono text-xs text-[var(--lab-muted)]">
            {filter.category}
          </span>
          <h1 className="text-2xl font-semibold tracking-tight">
            {filter.name}
          </h1>
        </div>
      </div>

      <div className="w-full max-w-2xl flex flex-col gap-10">
        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-medium text-[var(--lab-muted)]">
            Overview
          </h2>
          <p className="leading-relaxed">{filter.overview}</p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-medium text-[var(--lab-muted)]">
            How it works
          </h2>
          <ol className="flex flex-col gap-1.5">
            {filter.howItWorks.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="font-mono text-[var(--lab-muted)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-medium text-[var(--lab-muted)]">
            Kernel & formula
          </h2>
          <div className="inline-grid grid-cols-3 gap-px bg-[var(--lab-hairline)] border border-[var(--lab-hairline)] w-fit">
            {filter.kernel.flat().map((cell, i) => (
              <div
                key={i}
                className="bg-[var(--lab-surface)] w-16 h-12 flex items-center justify-center font-mono text-sm"
              >
                {cell}
              </div>
            ))}
          </div>
          <p className="font-mono text-sm bg-[var(--lab-surface)] border border-[var(--lab-hairline)] p-3">
            {filter.formula}
          </p>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-sm font-medium text-[var(--lab-good)]">
              Advantages
            </h2>
            <ul className="flex flex-col gap-1.5">
              {filter.pros.map((pro, i) => (
                <li key={i} className="text-sm flex gap-2">
                  <span className="text-[var(--lab-good)]">+</span>
                  {pro}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-sm font-medium text-[var(--lab-bad)]">
              Limitations
            </h2>
            <ul className="flex flex-col gap-1.5">
              {filter.cons.map((con, i) => (
                <li key={i} className="text-sm flex gap-2">
                  <span className="text-[var(--lab-bad)]">−</span>
                  {con}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-[var(--lab-surface)] border border-[var(--lab-hairline)] p-4">
          <span className="text-xs text-[var(--lab-muted)]">best for</span>
          <p className="font-medium">{filter.bestFor}</p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-medium text-[var(--lab-muted)]">Code</h2>
          <pre className="bg-[#17140F] text-[#F5F1EA] p-4 overflow-x-auto text-sm font-mono">
            {filter.codeSnippet}
          </pre>
        </section>

        <section className="flex flex-col gap-6">
          <h2 className="text-sm font-medium text-[var(--lab-muted)]">
            Exam questions
          </h2>
          {filter.examQA.map((qa, i) => (
            <div
              key={i}
              className="bg-[var(--lab-surface)] border border-[var(--lab-hairline)] p-5 flex flex-col gap-3"
            >
              <p className="font-medium">{qa.question}</p>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-[var(--lab-muted)]">
                  ব্যাখ্যা
                </span>
                <p className="text-sm leading-relaxed">
                  {qa.bengaliExplanation}
                </p>
              </div>
              <div className="flex flex-col gap-1 border-t border-[var(--lab-hairline)] pt-3">
                <span className="text-xs text-[var(--lab-muted)]">
                  exam answer
                </span>
                <p className="text-sm leading-relaxed">{qa.examAnswer}</p>
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
