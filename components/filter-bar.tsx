import { ChevronDown, Eye, Save, Search, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const filters = ["Market", "Category", "Provider", "Tier", "Confidence", "Risk"];

export function FilterBar() {
  return (
    <section className="rounded-2xl border border-border/65 bg-card/74 p-3 shadow-lab-glow">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <Input
            className="h-11 pl-9"
            placeholder="Search products, keywords, or provider..."
            type="search"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {filters.map((filter) => (
            <Button key={filter} size="sm" type="button" variant="outline">
              {filter}
              <ChevronDown className="size-3.5" />
            </Button>
          ))}
          <Button size="sm" type="button" variant="secondary">
            <SlidersHorizontal className="size-3.5" />
            More filters
          </Button>
          <Button size="sm" type="button">
            <Save className="size-3.5" />
            Save View
          </Button>
          <Button size="sm" type="button" variant="outline">
            <Eye className="size-3.5" />
            Views
          </Button>
        </div>
      </div>
    </section>
  );
}
