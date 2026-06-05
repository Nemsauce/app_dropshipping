"use client";

import type { FormEvent, ReactNode } from "react";
import { useState } from "react";
import { AlertTriangle, CheckCircle2, Loader2, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ManualResearchFormProps = {
  children?: ReactNode;
};

type SubmitStatus = "idle" | "loading" | "success" | "error";
type DropiCountry = "COLOMBIA" | "MEXICO";

type ManualResearchApiResponse = {
  ok: boolean;
  status: string;
  message: string;
  dropiProductId?: string;
  dropiCountry?: DropiCountry;
  data?: unknown;
};

function isManualResearchApiResponse(
  value: unknown,
): value is ManualResearchApiResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    "ok" in value &&
    "status" in value &&
    "message" in value &&
    typeof value.ok === "boolean" &&
    typeof value.status === "string" &&
    typeof value.message === "string"
  );
}

function validateDropiProductId(value: string): string | null {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return "Enter a Dropi product ID.";
  }

  if (
    !/^\d+$/.test(trimmedValue) ||
    trimmedValue.length < 3 ||
    trimmedValue.length > 20
  ) {
    return "Dropi product ID must contain digits only.";
  }

  return null;
}

function getCountryLabel(country: DropiCountry): string {
  return country === "MEXICO" ? "Mexico" : "Colombia";
}

function getButtonLabel(status: SubmitStatus): string {
  if (status === "loading") {
    return "Sending to research pipeline...";
  }

  if (status === "success") {
    return "Request submitted";
  }

  if (status === "error") {
    return "Retry Analysis";
  }

  return "Analyze Product";
}

function getDisplayStatus(status: SubmitStatus, apiStatus: string | null) {
  if (status === "success") {
    return apiStatus?.toLowerCase() === "completed" ? "Completed" : "Submitted";
  }

  if (status === "error") {
    return "Error";
  }

  return null;
}

export function ManualResearchForm({ children }: ManualResearchFormProps) {
  const [dropiProductId, setDropiProductId] = useState("");
  const [dropiCountry, setDropiCountry] = useState<DropiCountry>("COLOMBIA");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [lastSubmittedId, setLastSubmittedId] = useState<string | null>(null);
  const [lastSubmittedCountry, setLastSubmittedCountry] =
    useState<DropiCountry | null>(null);
  const [apiStatus, setApiStatus] = useState<string | null>(null);

  const displayStatus = getDisplayStatus(submitStatus, apiStatus);
  const showSuccess = submitStatus === "success" && displayStatus !== null;
  const showError = submitStatus === "error";

  function clearForm() {
    setDropiProductId("");
    setDropiCountry("COLOMBIA");
    setValidationError(null);
    setSubmitStatus("idle");
    setResponseMessage(null);
    setLastSubmittedId(null);
    setLastSubmittedCountry(null);
    setApiStatus(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const error = validateDropiProductId(dropiProductId);
    const trimmedDropiProductId = dropiProductId.trim();

    if (error) {
      setValidationError(error);
      setSubmitStatus("idle");
      setResponseMessage(null);
      setLastSubmittedId(null);
      setLastSubmittedCountry(null);
      setApiStatus(null);
      return;
    }

    setValidationError(null);
    setSubmitStatus("loading");
    setResponseMessage(null);
    setLastSubmittedId(null);
    setLastSubmittedCountry(null);
    setApiStatus(null);

    try {
      const response = await fetch("/api/manual-research/dropi-id", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dropiProductId: trimmedDropiProductId,
          dropiCountry,
        }),
      });
      const responseBody: unknown = await response.json().catch(() => null);

      if (!isManualResearchApiResponse(responseBody)) {
        setSubmitStatus("error");
        setResponseMessage(
          "Manual research request failed. Check the local server and n8n workflow.",
        );
        return;
      }

      if (!response.ok || !responseBody.ok) {
        setSubmitStatus("error");
        setResponseMessage(responseBody.message);
        setApiStatus(responseBody.status);
        return;
      }

      setSubmitStatus("success");
      setResponseMessage(responseBody.message);
      setLastSubmittedId(responseBody.dropiProductId ?? trimmedDropiProductId);
      setLastSubmittedCountry(responseBody.dropiCountry ?? dropiCountry);
      setApiStatus(responseBody.status);
    } catch {
      setSubmitStatus("error");
      setResponseMessage(
        "Manual research request failed. Check the local server and n8n workflow.",
      );
    }
  }

  return (
    <>
      <section className="rounded-2xl border border-border/65 bg-card/74 p-5 shadow-lab-glow">
        <div className="flex flex-col gap-2">
          <h2 className="text-base font-semibold text-foreground">
            Analyze a specific product
          </h2>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            Enter a Dropi product ID and catalog country to request a fresh
            research run. DemandLab will send the request to n8n, and n8n will
            handle Dropi lookup, Meta Ads research, scoring, and Supabase
            upsert.
          </p>
        </div>

        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          <div className="grid max-w-3xl gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
            <div>
              <label
                className="text-xs font-semibold uppercase tracking-[0.16em] text-muted"
                htmlFor="dropi-product-id"
              >
                Dropi Product ID
              </label>
              <Input
                aria-describedby={
                  validationError ? "dropi-product-id-error" : undefined
                }
                aria-invalid={validationError ? "true" : "false"}
                className="mt-2 h-11"
                id="dropi-product-id"
                inputMode="numeric"
                onChange={(event) => {
                  setDropiProductId(event.target.value);
                  setValidationError(null);
                }}
                placeholder="Example: 1678755"
                value={dropiProductId}
              />
              {validationError ? (
                <p
                  className="mt-2 flex items-center gap-2 text-xs font-medium text-risk"
                  id="dropi-product-id-error"
                >
                  <AlertTriangle className="size-3.5" />
                  {validationError}
                </p>
              ) : null}
            </div>

            <div>
              <label
                className="text-xs font-semibold uppercase tracking-[0.16em] text-muted"
                htmlFor="dropi-country"
              >
                Dropi Catalog Country
              </label>
              <select
                className="mt-2 flex h-11 w-full rounded-xl border border-border/70 bg-card-elevated px-3 py-2 text-sm text-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-demand/45"
                id="dropi-country"
                onChange={(event) =>
                  setDropiCountry(event.target.value as DropiCountry)
                }
                value={dropiCountry}
              >
                <option
                  className="bg-card-elevated text-foreground"
                  value="COLOMBIA"
                >
                  Colombia
                </option>
                <option
                  className="bg-card-elevated text-foreground"
                  value="MEXICO"
                >
                  Mexico
                </option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button disabled={submitStatus === "loading"} type="submit">
              {submitStatus === "loading" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
              {getButtonLabel(submitStatus)}
            </Button>
            <Button onClick={clearForm} type="button" variant="secondary">
              Clear
            </Button>
          </div>
        </form>
      </section>

      {children}

      <section className="rounded-2xl border border-border/65 bg-card/74 p-5 shadow-lab-glow">
        <h2 className="text-base font-semibold text-foreground">
          Research request status
        </h2>

        {submitStatus === "idle" ? (
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            No manual research request has been submitted in this session.
          </p>
        ) : null}

        {showSuccess ? (
          <div className="mt-4 space-y-3 rounded-2xl border border-opportunity/25 bg-opportunity/8 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-opportunity">
              <CheckCircle2 className="size-4" />
              Status: {displayStatus}
            </div>
            {lastSubmittedId ? (
              <div className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  Dropi Product ID:
                </span>{" "}
                {lastSubmittedId}
              </div>
            ) : null}
            {lastSubmittedCountry ? (
              <div className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  Dropi Catalog Country:
                </span>{" "}
                {getCountryLabel(lastSubmittedCountry)}
              </div>
            ) : null}
            {responseMessage ? (
              <div className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Message:</span>{" "}
                {responseMessage}
              </div>
            ) : null}
            <p className="text-sm leading-6 text-muted-foreground">
              The workflow may still be running in n8n. Refresh Products after
              the workflow finishes to see updated data.
            </p>
          </div>
        ) : null}

        {showError ? (
          <div className="mt-4 space-y-3 rounded-2xl border border-risk/25 bg-risk/8 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-risk">
              <AlertTriangle className="size-4" />
              Status: Error
            </div>
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Message:</span>{" "}
              {responseMessage ??
                "Manual research request failed. Check the local server and n8n workflow."}
            </div>
          </div>
        ) : null}

        {submitStatus === "loading" ? (
          <div className="mt-4 flex items-center gap-2 rounded-2xl border border-demand/25 bg-demand/8 p-4 text-sm font-medium text-demand">
            <Loader2 className="size-4 animate-spin" />
            Sending to research pipeline...
          </div>
        ) : null}
      </section>
    </>
  );
}
