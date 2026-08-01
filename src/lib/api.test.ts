import { describe, expect, it } from "vitest";
import { z } from "zod";
import { apiError, parseRequest } from "./api";

function jsonRequest(body: string) {
  return new Request("https://lifearg.example/api", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
  });
}

describe("API request helpers", () => {
  it("returns structured errors with optional details", async () => {
    const response = apiError("VALIDATION_FAILED", "Datos inválidos", 422, { field: "intent" });

    expect(response.status).toBe(422);
    await expect(response.json()).resolves.toEqual({
      error: {
        code: "VALIDATION_FAILED",
        message: "Datos inválidos",
        details: { field: "intent" },
      },
    });
  });

  it("rejects malformed JSON", async () => {
    const result = await parseRequest(jsonRequest("{"), z.object({ intent: z.string() }));

    if (!result.response) throw new Error("Expected malformed JSON to return an error response");
    expect(result.response.status).toBe(400);
    await expect(result.response.json()).resolves.toMatchObject({ error: { code: "INVALID_JSON" } });
  });

  it("rejects payloads that fail schema validation", async () => {
    const result = await parseRequest(jsonRequest(JSON.stringify({ intent: 3 })), z.object({ intent: z.string() }));

    if (!result.response) throw new Error("Expected invalid data to return an error response");
    expect(result.response.status).toBe(400);
    await expect(result.response.json()).resolves.toMatchObject({
      error: { code: "VALIDATION_FAILED", details: { fieldErrors: { intent: expect.any(Array) } } },
    });
  });

  it("returns parsed and normalized data", async () => {
    const schema = z.object({ intent: z.string().trim().min(1) });

    await expect(parseRequest(jsonRequest(JSON.stringify({ intent: "  exploring " })), schema)).resolves.toEqual({
      data: { intent: "exploring" },
    });
  });
});
