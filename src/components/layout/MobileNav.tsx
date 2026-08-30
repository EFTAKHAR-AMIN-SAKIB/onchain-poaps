"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  PlusCircle,
  Grid,
  ShieldCheck,
  BookOpen,
  LayoutDashboard,
} from "lucide-react";

export function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/explore", label: "Explore", icon: Compass },
    { href: "/create", label: "Create", icon: PlusCircle },
    { href: "/gallery", label: "My POAPs", icon: Grid },
    { href: "/verify", label: "Verify", icon: ShieldCheck },
    { href: "/dashboard", label: "Studio", icon: LayoutDashboard },
    { href: "/docs", label: "Docs", icon: BookOpen },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-lg border-t border-neutral-200 dark:border-neutral-800 px-2 py-2 safe-area-pb">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors ${
                isActive
                  ? "text-neutral-900 dark:text-white font-semibold"
                  : "text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
              }`}
            >
              <Icon
                className={`w-4 h-4 ${
                  isActive ? "text-neutral-900 dark:text-white" : ""
                }`}
              />
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
