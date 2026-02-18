"use client";

import { useEffect, useState } from "react";
import type { Heading } from "@/lib/types";

interface TableOfContentsProps {
  headings: Heading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-80px 0% -80% 0%" }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  return (
    <nav aria-label="Table of contents" className="border-l border-slate-200 pl-4">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
        On this page
      </h3>
      <ul className="space-y-2">
        {headings.map(({ id, text, level }) => (
          <li
            key={id}
            style={{ paddingLeft: level === 3 ? "1rem" : 0 }}
            className="text-sm"
          >
            <a
              href={`#${id}`}
              className={
                activeId === id
                  ? "font-medium text-slate-900"
                  : "text-slate-600 hover:text-slate-900"
              }
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
