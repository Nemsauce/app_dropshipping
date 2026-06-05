export type CurrencyCode = "COP" | "MXN" | "USD" | "MULTI";

type FormatCurrencyValueParams = {
  value?: number | null;
  currency?: CurrencyCode;
  fallback?: string;
};

export function clampScore(value: number | null | undefined): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 0;
  }

  return Math.min(100, Math.max(0, Math.round(value)));
}

export function formatScore(value: number | null | undefined): string {
  return String(clampScore(value));
}

export function formatPercent(
  value: number | string | null | undefined,
): string {
  if (typeof value === "string" && value.includes("%")) {
    return value;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return `${Math.round(value)}%`;
  }

  return "0%";
}

export function formatCurrencyValue({
  value,
  currency,
  fallback,
}: FormatCurrencyValueParams): string {
  if (fallback) {
    return fallback;
  }

  if (currency === "MULTI") {
    return "Multi-currency";
  }

  if (typeof value !== "number" || !Number.isFinite(value)) {
    return "N/A";
  }

  const roundedValue = Math.round(value);

  if (currency === "COP") {
    return `COP $${roundedValue.toLocaleString("es-CO")}`;
  }

  if (currency === "MXN") {
    return `MXN $${roundedValue.toLocaleString("en-US")}`;
  }

  if (currency === "USD") {
    return `USD $${roundedValue.toLocaleString("en-US")}`;
  }

  return "N/A";
}

export function formatMarketLabel(value: string | null | undefined): string {
  if (!value) {
    return "Unknown";
  }

  const normalizedValue = value.trim().toUpperCase();

  if (normalizedValue === "CO") {
    return "Colombia";
  }

  if (normalizedValue === "MX") {
    return "Mexico";
  }

  if (normalizedValue === "CO + MX") {
    return "Colombia + Mexico";
  }

  return value;
}
