"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DOCS_SECTIONS, DocSection } from "@/docs/content";
import { BookOpen, Search, ArrowRight, Sparkles } from "lucide-react";

export default function DocsIndexPage() {
  const [search, setSearch] = useState("");

  const categories: Array<DocSection["category"]> = [
    "Fundamentals",
    "Creation & SVG",
    "Distribution",
    "Security & Mechanics",
    "Developer & Integration",
  ];

  const filteredDocs = DOCS_SECTIONS.filter((doc) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      doc.title.toLowerCase().includes(q) ||
      doc.summary.toLowerCase().includes(q) ||
      doc.content.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-12 text-neutral-900 dark:text-neutral-100">
      {/* Docs Header */}
      <div className="space-y-3 text-center sm:text-left border-b border-neutral-200/80 dark:border-neutral-800 pb-8">
        <div className="flex items-center gap-2 justify-center sm:justify-start">
          <BookOpen className="w-4 h-4 text-lime-600 dark:text-lime-400" />
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
            Protocol Knowledge Base
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Onchain POAPs Documentation
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-2xl">
          Everything you need to know about designing vector artwork, Merkle allowlists, cryptographic signature claims, and contract architecture.
        </p>

        {/* Search */}
        <div className="pt-4 max-w-md">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search all 21 documentation guides..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-neutral-400 shadow-xs transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Docs Categories Grid */}
      <div className="space-y-12 text-left">
        {categories.map((cat) => {
          const categoryDocs = filteredDocs.filter((d) => d.category === cat);
          if (categoryDocs.length === 0) return null;

          return (
            <div key={cat} className="space-y-4">
              <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                <Sparkles className="w-3.5 h-3.5 text-lime-500" />
                {cat} ({categoryDocs.length})
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryDocs.map((doc) => (
                  <Link
                    key={doc.slug}
                    href={`/docs/${doc.slug}`}
                    className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 shadow-card hover:shadow-card-hover transition-all duration-200 hover:-translate-y-1 group flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <h3 className="text-base font-bold text-neutral-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {doc.title}
                      </h3>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-2">
                        {doc.summary}
                      </p>
                    </div>

                    <div className="pt-4 flex items-center justify-between text-xs font-semibold text-neutral-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      <span>Read Guide</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
