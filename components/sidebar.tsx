"use client";

import {
  Beaker,
  ClipboardCheck,
  FlaskConical,
  Gauge,
  LayoutDashboard,
  PackageSearch,
  Radar,
  Search,
  Settings,
  Target,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Opportunities", href: "/opportunities", icon: Target },
  { label: "Products", href: "/products", icon: PackageSearch },
  { label: "Research", href: "/research", icon: Search },
  { label: "Market Radar", href: "/market-radar", icon: Radar },
  { label: "Manual Review", href: "/manual-review", icon: ClipboardCheck },
  { label: "Tests", href: "/tests", icon: Gauge },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-border/60 bg-[#090D16]/92 px-4 py-4 backdrop-blur-xl lg:flex lg:flex-col">
      <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card-elevated/70 px-4 py-3 shadow-lab-glow">
        <div className="flex size-10 items-center justify-center rounded-xl border border-demand/25 bg-demand/12 text-demand">
          <FlaskConical className="size-5" />
        </div>
        <div>
          <div className="text-sm font-semibold tracking-wide text-foreground">
            DemandLab
          </div>
          <div className="text-xs text-muted-foreground">Command Center</div>
        </div>
      </div>

      <nav className="mt-6 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              href={item.href}
              key={item.label}
              className={cn(
                "group flex h-11 w-full items-center gap-3 rounded-xl border px-3 text-left text-sm transition-colors",
                active
                  ? "border-demand/25 bg-demand/10 text-foreground shadow-[inset_3px_0_0_rgba(56,189,248,0.8)]"
                  : "border-transparent text-muted-foreground hover:border-border/70 hover:bg-card/60 hover:text-foreground",
              )}
            >
              <Icon
                className={cn(
                  "size-4",
                  active
                    ? "text-demand"
                    : "text-muted group-hover:text-muted-foreground",
                )}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-2xl border border-border/70 bg-gradient-to-br from-card-elevated to-card p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Beaker className="size-4 text-intelligence" />
              Intelligence Engine
            </div>
            <div className="mt-1 text-xs text-muted">v0.1.0</div>
          </div>
          <span className="mt-1 size-2.5 rounded-full bg-opportunity shadow-[0_0_14px_rgba(34,197,94,0.9)]" />
        </div>
        <div className="mt-4 rounded-xl border border-opportunity/20 bg-opportunity/8 px-3 py-2 text-xs text-opportunity">
          All systems operational
        </div>
        <button
          className="mt-3 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          type="button"
        >
          Collapse
        </button>
      </div>
    </aside>
  );
}
