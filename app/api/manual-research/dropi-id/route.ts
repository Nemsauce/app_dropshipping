export const dynamic = "force-dynamic";

type ManualResearchResponse = {
  ok: boolean;
  status: string;
  message: string;
  dropiProductId?: string;
  dropiCountry?: DropiCountry;
  data?: unknown;
};

type DropiCountry = "COLOMBIA" | "MEXICO";

type ValidationResult =
  | {
      ok: true;
      dropiProductId: string;
      dropiCountry: DropiCountry;
    }
  | {
      ok: false;
      response: Response;
    };

const SENSITIVE_KEY_PARTS = [
  "authorization",
  "secret",
  "token",
  "webhook",
];

function jsonResponse(body: ManualResearchResponse, status: number): Response {
  return Response.json(body, { status });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function sanitizeN8nData(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeN8nData(item));
  }

  if (!isRecord(value)) {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => {
        const normalizedKey = key.toLowerCase();

        return !SENSITIVE_KEY_PARTS.some((part) =>
          normalizedKey.includes(part),
        );
      })
      .map(([key, nestedValue]) => [key, sanitizeN8nData(nestedValue)]),
  );
}

function getStringField(data: unknown, field: string): string | null {
  if (!isRecord(data)) {
    return null;
  }

  const value = data[field];

  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function getDropiCountryLabel(value: unknown): DropiCountry | null {
  if (value === null || value === undefined) {
    return null;
  }

  const dropiCountry = String(value).trim().toUpperCase();

  return dropiCountry === "COLOMBIA" || dropiCountry === "MEXICO"
    ? dropiCountry
    : null;
}

async function readJsonBody(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

function validateDropiProductId(body: unknown): ValidationResult {
  if (!isRecord(body)) {
    return {
      ok: false,
      response: jsonResponse(
        {
          ok: false,
          status: "error",
          message: "Invalid JSON body.",
        },
        400,
      ),
    };
  }

  const rawDropiProductId = body.dropiProductId;

  if (rawDropiProductId === null || rawDropiProductId === undefined) {
    return {
      ok: false,
      response: jsonResponse(
        {
          ok: false,
          status: "error",
          message: "Enter a Dropi product ID.",
        },
        400,
      ),
    };
  }

  const dropiProductId = String(rawDropiProductId).trim();

  if (!dropiProductId) {
    return {
      ok: false,
      response: jsonResponse(
        {
          ok: false,
          status: "error",
          message: "Enter a Dropi product ID.",
        },
        400,
      ),
    };
  }

  if (
    !/^\d+$/.test(dropiProductId) ||
    dropiProductId.length < 3 ||
    dropiProductId.length > 20
  ) {
    return {
      ok: false,
      response: jsonResponse(
        {
          ok: false,
          status: "error",
          message: "Dropi product ID must contain digits only.",
        },
        400,
      ),
    };
  }

  const dropiCountry = getDropiCountryLabel(body.dropiCountry);

  if (!dropiCountry) {
    return {
      ok: false,
      response: jsonResponse(
        {
          ok: false,
          status: "error",
          message: "Select a valid Dropi catalog country.",
        },
        400,
      ),
    };
  }

  return {
    ok: true,
    dropiProductId,
    dropiCountry,
  };
}

async function readN8nResponse(response: Response): Promise<unknown | null> {
  const text = await response.text();

  if (!text.trim()) {
    return null;
  }

  try {
    return sanitizeN8nData(JSON.parse(text));
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const body = await readJsonBody(request);
  const validation = validateDropiProductId(body);

  if (!validation.ok) {
    return validation.response;
  }

  const webhookUrl = process.env.N8N_MANUAL_RESEARCH_WEBHOOK_URL;
  const webhookSecret = process.env.N8N_MANUAL_RESEARCH_SECRET;

  if (!webhookUrl) {
    return jsonResponse(
      {
        ok: false,
        status: "error",
        message: "Manual research webhook is not configured.",
      },
      500,
    );
  }

  const headers = new Headers({
    "Content-Type": "application/json",
  });

  if (webhookSecret) {
    headers.set("X-DemandLab-Secret", webhookSecret);
  }

  try {
    const n8nResponse = await fetch(webhookUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({
      dropiProductId: validation.dropiProductId,
      dropiCountry: validation.dropiCountry,
      source: "demandlab",
      requestedAt: new Date().toISOString(),
      demandlabSecret: webhookSecret || "",
}),
    });
    const n8nData = await readN8nResponse(n8nResponse);

    if (!n8nResponse.ok) {
      return jsonResponse(
        {
          ok: false,
          status: "error",
          message: "Manual research workflow failed to accept the request.",
          dropiProductId: validation.dropiProductId,
          dropiCountry: validation.dropiCountry,
          data: n8nData,
        },
        502,
      );
    }

    return jsonResponse(
      {
        ok: true,
        status: getStringField(n8nData, "status") ?? "submitted",
        message: getStringField(n8nData, "message") ?? "Request submitted",
        dropiProductId: validation.dropiProductId,
        dropiCountry: validation.dropiCountry,
        data: n8nData,
      },
      200,
    );
  } catch {
    return jsonResponse(
      {
        ok: false,
        status: "error",
        message: "Manual research workflow is unavailable.",
        dropiProductId: validation.dropiProductId,
        dropiCountry: validation.dropiCountry,
      },
      502,
    );
  }
}
