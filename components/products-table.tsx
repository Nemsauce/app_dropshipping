import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight, Boxes, CircleDotDashed } from "lucide-react";

import type { ProductOpportunity } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { formatMarketLabel, formatPercent, formatScore } from "@/lib/formatters";
import {
  getCompetitionTone,
  getConfidenceTone,
  getDemandTone,
  getRiskTone,
} from "@/lib/scoring-ui";
import { ScoreBadge } from "@/components/score-badge";
import { StatusBadge } from "@/components/status-badge";

const thumbnailStyles: Record<ProductOpportunity["thumbnailTone"], string> = {
  blue: "from-demand/25 to-demand/5 text-demand border-demand/30",
  green: "from-opportunity/25 to-opportunity/5 text-opportunity border-opportunity/30",
  yellow: "from-review/25 to-review/5 text-review border-review/30",
  purple: "from-intelligence/25 to-intelligence/5 text-intelligence border-intelligence/30",
  red: "from-risk/25 to-risk/5 text-risk border-risk/30",
};

type ProductsTableProps = {
  products: ProductOpportunity[];
  selectedProductId: string;
  rowHref?: (product: ProductOpportunity) => string;
  variant?: "dashboard" | "scanner";
};

type TableCellProps = {
  children: ReactNode;
  contentClassName: string;
  href?: string;
  title?: string;
};

function TableCell({
  children,
  contentClassName,
  href,
  title,
}: TableCellProps) {
  const className = cn(
    "block h-full text-inherit no-underline",
    contentClassName,
  );

  return (
    <td className="border-t border-border/45" title={title}>
      {href ? (
        <Link
          className={cn(
            className,
            "rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-demand/45",
          )}
          href={href}
        >
          {children}
        </Link>
      ) : (
        <div className={className}>{children}</div>
      )}
    </td>
  );
}

export function ProductsTable({
  products,
  rowHref,
  selectedProductId,
  variant = "dashboard",
}: ProductsTableProps) {
  const isScanner = variant === "scanner";

  return (
    <section className="overflow-hidden rounded-2xl border border-border/65 bg-card/78 shadow-lab-glow">
      <div className="flex items-center justify-between gap-4 border-b border-border/60 px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            {isScanner ? "Opportunity Scanner" : "Product Opportunity Queue"}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {isScanner
              ? "Compare demand, visible competition, stock, and next action"
              : "Ranked candidates across demand, competition, margin, and risk"}
          </p>
        </div>
        <div className="hidden items-center gap-2 rounded-full border border-intelligence/25 bg-intelligence/10 px-3 py-1.5 text-xs font-medium text-intelligence sm:flex">
          <CircleDotDashed className="size-3.5" />
          {isScanner ? "Open rows for detail" : "Selected row"}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table
          className={cn(
            "w-full border-separate border-spacing-0 text-left",
            isScanner ? "min-w-[1040px]" : "min-w-[1180px]",
          )}
        >
          <thead>
            <tr className="text-[11px] uppercase tracking-[0.14em] text-muted">
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-3 py-3 font-medium">Market</th>
              <th className="px-3 py-3 font-medium">
                {isScanner ? "Demand" : "Global Demand"}
              </th>
              <th className="px-3 py-3 font-medium">CO Competition</th>
              <th className="px-3 py-3 font-medium">MX Competition</th>
              <th className="px-3 py-3 font-medium">Margin</th>
              {!isScanner ? (
                <th className="px-3 py-3 font-medium">Profit</th>
              ) : null}
              <th className="px-3 py-3 font-medium">Stock</th>
              {!isScanner ? (
                <th className="px-3 py-3 font-medium">Confidence</th>
              ) : null}
              {isScanner ? (
                <th className="px-4 py-3 font-medium">Action</th>
              ) : null}
              <th className="px-3 py-3 font-medium">Risk</th>
              {!isScanner ? (
                <th className="px-4 py-3 font-medium">Recommendation</th>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const selected = product.id === selectedProductId;
              const href = rowHref?.(product);

              return (
                <tr
                  className={cn(
                    "group border-t border-border/50 text-sm transition-colors",
                    href ? "cursor-pointer hover:bg-card-elevated/62" : "",
                    selected
                      ? "bg-intelligence/10 outline outline-1 -outline-offset-1 outline-intelligence/45"
                      : "",
                  )}
                  key={product.id}
                >
                  <TableCell contentClassName="px-4 py-3" href={href}>
                    <div className="flex min-w-72 items-center gap-3">
                      <div
                        className={cn(
                          "flex size-11 shrink-0 items-center justify-center rounded-xl border bg-gradient-to-br",
                          thumbnailStyles[product.thumbnailTone],
                        )}
                      >
                        <Boxes className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="truncate font-medium text-foreground">
                            {product.name}
                          </span>
                          {selected ? (
                            <ArrowUpRight className="size-3.5 shrink-0 text-intelligence" />
                          ) : null}
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          {isScanner ? (
                            <>
                              <span>ID {product.id}</span>
                              {product.sku ? (
                                <>
                                  <span className="text-muted">/</span>
                                  <span>SKU {product.sku}</span>
                                </>
                              ) : null}
                              <span className="text-muted">/</span>
                              <span>{product.provider}</span>
                              <span className="rounded-full border border-border/70 bg-card-elevated px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                                TIER {product.tier}
                              </span>
                            </>
                          ) : (
                            <>
                              <span>{product.category}</span>
                              <span className="text-muted">/</span>
                              <span>{product.provider}</span>
                              <span className="text-muted">/</span>
                              <span className="font-medium text-muted-foreground">
                                {product.displayPrice}
                              </span>
                              <span className="rounded-full border border-border/70 bg-card-elevated px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                                TIER {product.tier}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell
                    contentClassName="px-3 py-3 text-xs font-semibold text-muted-foreground"
                    href={href}
                    title={formatMarketLabel(product.targetMarket)}
                  >
                    {product.targetMarket}
                  </TableCell>
                  <TableCell contentClassName="px-3 py-3" href={href}>
                    <ScoreBadge
                      tone={getDemandTone(product.globalDemand)}
                      value={formatScore(product.globalDemand)}
                    />
                  </TableCell>
                  <TableCell contentClassName="px-3 py-3" href={href}>
                    <ScoreBadge
                      tone={getCompetitionTone(product.coCompetition)}
                      value={formatScore(product.coCompetition)}
                    />
                  </TableCell>
                  <TableCell contentClassName="px-3 py-3" href={href}>
                    <ScoreBadge
                      tone={getCompetitionTone(product.mxCompetition)}
                      value={formatScore(product.mxCompetition)}
                    />
                  </TableCell>
                  <TableCell
                    contentClassName="px-3 py-3 text-sm font-semibold text-opportunity tabular-nums"
                    href={href}
                  >
                    <div className="grid gap-1">
                      <span>{formatPercent(product.margin)}</span>
                      {isScanner ? (
                        <span className="text-xs font-medium text-muted-foreground">
                          {product.displayProfit}
                        </span>
                      ) : null}
                    </div>
                  </TableCell>
                  {!isScanner ? (
                    <TableCell
                      contentClassName="px-3 py-3 text-sm font-semibold text-foreground tabular-nums"
                      href={href}
                    >
                      {product.displayProfit}
                    </TableCell>
                  ) : null}
                  <TableCell
                    contentClassName="px-3 py-3 text-sm text-muted-foreground tabular-nums"
                    href={href}
                  >
                    {product.stock}
                  </TableCell>
                  {!isScanner ? (
                    <TableCell contentClassName="px-3 py-3" href={href}>
                      <ScoreBadge
                        tone={getConfidenceTone(product.confidence)}
                        value={formatScore(product.confidence)}
                      />
                    </TableCell>
                  ) : null}
                  {isScanner ? (
                    <TableCell contentClassName="px-4 py-3" href={href}>
                      <StatusBadge status={product.recommendation} />
                    </TableCell>
                  ) : null}
                  <TableCell contentClassName="px-3 py-3" href={href}>
                    <ScoreBadge
                      tone={getRiskTone(product.risk)}
                      value={product.risk}
                    />
                  </TableCell>
                  {!isScanner ? (
                    <TableCell contentClassName="px-4 py-3" href={href}>
                      <StatusBadge status={product.recommendation} />
                    </TableCell>
                  ) : null}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
