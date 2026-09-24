"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Menu, X, Sun, Moon } from "lucide-react";

const NAV_LINKS = [
  { href: "/bench", label: "Bench" },
  { href: "/filters", label: "Library" },
];

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.04-.02-2.04-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.08 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.3 3.49 1 .11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.53.12-3.19 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.89.12 3.19.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22 0 1.6-.02 2.89-.02 3.29 0 .32.22.7.83.58C20.56 21.79 24 17.3 24 12c0-6.63-5.37-12-12-12Z" />
    </svg>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <nav className="w-full border-b border-[var(--lab-hairline)] bg-[var(--lab-bg)]">
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-14">
        <Link
          href="/"
          className="font-semibold tracking-tight text-[var(--lab-ink)]"
          onClick={() => setIsOpen(false)}
        >
          DIP Filter Lab
        </Link>

        <div className="hidden sm:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-[var(--lab-muted)] hover:text-[var(--lab-ink)] transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://github.com/tanzid-48/dip-filter-tool"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View source on GitHub"
            className="text-[var(--lab-muted)] hover:text-[var(--lab-ink)] transition-colors"
          >
            <GithubIcon className="h-4.5 w-4.5" />
          </a>
          {mounted && (
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="text-[var(--lab-muted)] hover:text-[var(--lab-ink)] transition-colors"
            >
              {resolvedTheme === "dark" ? (
                <Sun className="h-4.5 w-4.5" />
              ) : (
                <Moon className="h-4.5 w-4.5" />
              )}
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 sm:hidden">
          {mounted && (
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="text-[var(--lab-ink)]"
            >
              {resolvedTheme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            className="text-[var(--lab-ink)]"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="sm:hidden border-t border-[var(--lab-hairline)] px-4 py-4 flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-sm text-[var(--lab-ink)]"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://github.com/tanzid-48/dip-filter-tool"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-[var(--lab-ink)]"
          >
            <GithubIcon className="h-4 w-4" />
            GitHub
          </a>
        </div>
      )}
    </nav>
  );
}
