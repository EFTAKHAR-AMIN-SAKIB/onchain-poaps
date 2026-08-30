"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { DOCS_SECTIONS } from "@/docs/content";
import {
  BookOpen,
  ArrowLeft,
  ArrowRight,
  Code2,
  ChevronRight,
} from "lucide-react";

export default function DocDetailPage() {
  const params = useParams();
  const slug = (params?.slug as string) || "";

  const currentIndex = DOCS_SECTIONS.findIndex((d) => d.slug === slug);
  const doc = DOCS_SECTIONS[currentIndex] || DOCS_SECTIONS[0];
  const prevDoc = currentIndex > 0 ? DOCS_SECTIONS[currentIndex - 1] : null;
  const nextDoc = currentIndex < DOCS_SECTIONS.length - 1 ? DOCS_SECTIONS[currentIndex + 1] : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 text-neutral-900 dark:text-neutral-100">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Sidebar Navigation */}
        <div className="hidden lg:block lg:col-span-4 sticky top-24 space-y-4 max-h-[80vh] overflow-y-auto pr-2">
          <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-neutral-500 pb-2 border-b border-neutral-200 dark:border-neutral-800">
            <BookOpen className="w-4 h-4 text-lime-600 dark:text-lime-400" />
            Documentation Index
          </div>

          <div className="space-y-1">
            {DOCS_SECTIONS.map((item) => {
              const isCurrent = item.slug === doc.slug;
              return (
                <Link
                  key={item.slug}
                  href={`/docs/${item.slug}`}
                  className={`block px-3 py-2 rounded-xl text-xs transition-all ${
                    isCurrent
                      ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold shadow-xs"
                      : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  }`}
                >
                  {item.title}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-8 text-left">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 border-b border-neutral-200 dark:border-neutral-800 pb-3">
            <Link href="/docs" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
              Docs
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-neutral-900 dark:text-white font-medium">{doc.category}</span>
          </div>

          {/* Title & Summary */}
          <div className="space-y-3">
            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-lime-100 dark:bg-lime-950/60 text-lime-800 dark:text-lime-300">
              {doc.category}
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
              {doc.title}
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed font-normal">
              {doc.summary}
            </p>
          </div>

          {/* Plain English Explanation */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-card space-y-4">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500">
              Overview & User Guide
            </div>
            <div className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-line space-y-3 font-normal">
              {doc.content}
            </div>
          </div>

          {/* Developer / Technical Details Section */}
          {doc.technicalDetails && (
            <div className="p-6 sm:p-8 rounded-3xl bg-neutral-50 dark:bg-neutral-950 border border-blue-200 dark:border-blue-900/50 shadow-card space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                <Code2 className="w-4 h-4" />
                Technical Details & Contract Architecture
              </div>
              <div className="text-xs sm:text-sm font-mono text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-line">
                {doc.technicalDetails}
              </div>
            </div>
          )}

          {/* Prev / Next Article Navigation */}
          <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {prevDoc ? (
              <Link href={`/docs/${prevDoc.slug}`} className="flex-1">
                <button className="w-full py-2.5 px-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center justify-start gap-2 shadow-xs transition-all">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span className="truncate">{prevDoc.title}</span>
                </button>
              </Link>
            ) : <div className="flex-1" />}

            {nextDoc ? (
              <Link href={`/docs/${nextDoc.slug}`} className="flex-1">
                <button className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 flex items-center justify-end gap-2 shadow-xs transition-all">
                  <span className="truncate">{nextDoc.title}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            ) : <div className="flex-1" />}
          </div>
        </div>
      </div>
    </div>
  );
}
